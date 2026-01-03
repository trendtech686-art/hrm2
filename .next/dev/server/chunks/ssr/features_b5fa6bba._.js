module.exports = [
"[project]/features/customers/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000001"),
        name: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        email: "info@hungthinhcorp.vn",
        phone: "0901112233",
        company: "Hưng Thịnh Corp",
        status: "Đang giao dịch",
        taxCode: "0301234567",
        zaloPhone: "0901112233",
        currentDebt: 30000000,
        maxDebt: 50000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        accountManagerName: "Trần Thị Bình",
        createdAt: "2024-03-10",
        updatedAt: "2025-10-21T09:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        totalOrders: 2,
        totalSpent: 42000000,
        totalQuantityPurchased: 5,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-09-20",
        failedDeliveries: 3,
        lastContactDate: "2025-10-18",
        nextFollowUpDate: "2025-11-05",
        followUpReason: "Đôn đốc ký phụ lục hợp đồng",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
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
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000001"),
                name: "Nguyễn Văn A",
                role: "Giám đốc",
                phone: "0901112233",
                email: "a.nguyen@hungthinhcorp.vn",
                isPrimary: true
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000002"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("DT000001"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000123"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000001"),
                reminderDate: "2025-10-21",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                reminderByName: "Trần Thị Bình",
                customerResponse: "Hứa trả",
                promisePaymentDate: "2025-10-27",
                notes: "KH đang chờ thanh toán từ khách của họ, hứa trả trong tuần này",
                createdAt: "2025-10-21T09:30:00Z"
            }
        ]
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000002"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000002"),
        name: "Chuỗi cà phê The Coffee House",
        email: "contact@thecoffeehouse.vn",
        phone: "02871087088",
        company: "The Coffee House",
        status: "Đang giao dịch",
        taxCode: "0313222173",
        zaloPhone: "0902888999",
        currentDebt: 0,
        maxDebt: 100000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        accountManagerName: "Đỗ Hùng",
        createdAt: "2024-01-25",
        updatedAt: "2025-10-10T08:15:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        totalOrders: 5,
        totalSpent: 156000000,
        totalQuantityPurchased: 15,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-10-10",
        failedDeliveries: 0,
        lastContactDate: "2025-10-15",
        nextFollowUpDate: "2025-12-01",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
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
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000003"),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000003"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000003"),
        name: "Anh Trần Minh Hoàng",
        email: "tmhoang.dev@gmail.com",
        phone: "0987123456",
        company: "Khách lẻ",
        status: "Đang giao dịch",
        zaloPhone: "0987123456",
        currentDebt: 0,
        maxDebt: 10000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        accountManagerName: "Vũ Thị Giang",
        createdAt: "2025-08-01",
        updatedAt: "2025-08-01T10:00:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000004"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000004"),
        name: "Shop thời trang GenZ Style",
        email: "genzstyle@fashion.com",
        phone: "0918765432",
        company: "GenZ Style",
        status: "Ngừng Giao Dịch",
        taxCode: "0398765432",
        zaloPhone: "0918765432",
        currentDebt: 500000,
        maxDebt: 20000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        accountManagerName: "Trịnh Văn Khoa",
        createdAt: "2023-11-15",
        updatedAt: "2024-09-20T16:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("DT000002"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000045"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000002"),
                reminderDate: "2024-07-01",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Gọi nhiều lần không nghe máy",
                createdAt: "2024-07-01T14:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000003"),
                reminderDate: "2024-08-15",
                reminderType: "Email",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Email gửi nhưng không phản hồi",
                createdAt: "2024-08-15T10:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000004"),
                reminderDate: "2024-09-20",
                reminderType: "Gặp trực tiếp",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Từ chối",
                notes: "KH gặp khó khăn tài chính, từ chối thanh toán. Đề xuất xử lý pháp lý",
                createdAt: "2024-09-20T16:30:00Z"
            }
        ]
    }
];
}),
"[project]/features/customers/lifecycle-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateLifecycleStage",
    ()=>calculateLifecycleStage,
    "getLifecycleStageVariant",
    ()=>getLifecycleStageVariant,
    "updateAllCustomerLifecycleStages",
    ()=>updateAllCustomerLifecycleStages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
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
    const daysSinceLastPurchase = lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(lastPurchaseDate)) : Infinity;
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
}),
"[project]/features/customers/credit-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/features/customers/intelligence-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
const calculateRFMScores = (customer, allCustomers)=>{
    // Recency: Số ngày từ lần mua cuối
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : 999999;
    // Frequency: Tổng số đơn hàng
    const frequency = customer.totalOrders || 0;
    // Monetary: Tổng chi tiêu
    const monetary = customer.totalSpent || 0;
    // Calculate percentiles for scoring
    const allRecencies = allCustomers.map((c)=>c.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(c.lastPurchaseDate)) : 999999).sort((a, b)=>a - b);
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
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
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
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
    const totalOrders = customer.totalOrders || 0;
    // Nếu khách mới (chưa có đơn hoặc chỉ 1 đơn), dùng default 30 ngày
    // Nếu khách cũ, tính dựa trên thời gian từ createdAt đến lastPurchaseDate / số đơn
    let avgDaysBetweenOrders = 30; // Default
    if (totalOrders > 1 && customer.createdAt && customer.lastPurchaseDate) {
        const customerAge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(customer.lastPurchaseDate), new Date(customer.createdAt));
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
}),
"[project]/features/customers/debt-tracking-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
const calculateDueDate = (orderDate, paymentTermsDays)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDays"])(new Date(orderDate), paymentTermsDays));
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
    const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(dueDate));
    return days > 0 ? days : 0;
};
const calculateDaysUntilDue = (dueDate)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(dueDate), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])());
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateBefore"])(new Date(current.dueDate), new Date(oldest.dueDate)) ? current : oldest;
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(dateString);
};
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
}),
"[project]/features/customers/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerStore",
    ()=>useCustomerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/lifecycle-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/credit-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/intelligence-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/debt-tracking-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'customers', {
    businessIdField: 'id',
    persistKey: 'hrm-customers',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Augmented methods
const augmentedMethods = {
    searchCustomers: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allCustomers = baseStore.getState().data;
                // Create fresh Fuse instance with current data (avoid stale data)
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allCustomers, {
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
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
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
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
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
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const customerWithLifecycle = {
            ...customer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer)
        };
        const newCustomer = baseStore.getState().add(customerWithLifecycle);
        // Add activity history entry
        const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo khách hàng ${newCustomer.name} (${newCustomer.id})`);
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
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const existingCustomer = baseStore.getState().data.find((c)=>c.systemId === systemId);
        const historyEntries = [];
        if (existingCustomer) {
            // Track status changes
            if (existingCustomer.status !== updatedCustomer.status) {
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, existingCustomer.status, updatedCustomer.status, `${userInfo.name} đã đổi trạng thái từ "${existingCustomer.status}" sang "${updatedCustomer.status}"`));
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
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
            }
        }
        const customerWithLifecycle = {
            ...updatedCustomer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer),
            activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingCustomer?.activityHistory, ...historyEntries)
        };
        console.log('[CustomerStore] Calling baseStore.update with:', customerWithLifecycle);
        // Call the update function from baseStore directly
        baseStore.getState().update(systemId, customerWithLifecycle);
        console.log('[CustomerStore] State after update:', baseStore.getState().data.find((c)=>c.systemId === systemId));
    },
    // Get customers with high debt risk
    getHighRiskDebtCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHighRiskDebtCustomers"])(activeCustomers);
    },
    // Batch update customer intelligence (RFM, health score, churn risk)
    updateCustomerIntelligence: ()=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.isDeleted) return customer;
                    // Calculate RFM
                    const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRFMScores"])(customer, allCustomers);
                    const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                    // Calculate health score
                    const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(customer);
                    // Calculate churn risk
                    const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(customer).risk;
                    // Calculate lifecycle stage
                    const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer);
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOverdueDebtCustomers"])(activeCustomers);
    },
    // Get customers with debt due soon
    getDueSoonCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDueSoonCustomers"])(activeCustomers);
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
}),
"[project]/features/settings/customers/api/customer-settings-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer Settings API Layer
 * Handles customer types, groups, sources, payment terms, credit ratings, lifecycle stages
 */ __turbopack_context__.s([
    "createCreditRating",
    ()=>createCreditRating,
    "createCustomerGroup",
    ()=>createCustomerGroup,
    "createCustomerSource",
    ()=>createCustomerSource,
    "createCustomerType",
    ()=>createCustomerType,
    "createLifecycleStage",
    ()=>createLifecycleStage,
    "createPaymentTerm",
    ()=>createPaymentTerm,
    "deleteCreditRating",
    ()=>deleteCreditRating,
    "deleteCustomerGroup",
    ()=>deleteCustomerGroup,
    "deleteCustomerSource",
    ()=>deleteCustomerSource,
    "deleteCustomerType",
    ()=>deleteCustomerType,
    "deleteLifecycleStage",
    ()=>deleteLifecycleStage,
    "deletePaymentTerm",
    ()=>deletePaymentTerm,
    "fetchCreditRatings",
    ()=>fetchCreditRatings,
    "fetchCustomerGroups",
    ()=>fetchCustomerGroups,
    "fetchCustomerSlaSettings",
    ()=>fetchCustomerSlaSettings,
    "fetchCustomerSources",
    ()=>fetchCustomerSources,
    "fetchCustomerTypes",
    ()=>fetchCustomerTypes,
    "fetchLifecycleStages",
    ()=>fetchLifecycleStages,
    "fetchPaymentTerms",
    ()=>fetchPaymentTerms,
    "updateCreditRating",
    ()=>updateCreditRating,
    "updateCustomerGroup",
    ()=>updateCustomerGroup,
    "updateCustomerSlaSetting",
    ()=>updateCustomerSlaSetting,
    "updateCustomerSource",
    ()=>updateCustomerSource,
    "updateCustomerType",
    ()=>updateCustomerType,
    "updateLifecycleStage",
    ()=>updateLifecycleStage,
    "updatePaymentTerm",
    ()=>updatePaymentTerm
]);
const BASE_URL = '/api/settings/customers';
async function fetchCustomerTypes() {
    const res = await fetch(`${BASE_URL}/types`);
    if (!res.ok) throw new Error('Failed to fetch customer types');
    return res.json();
}
async function createCustomerType(data) {
    const res = await fetch(`${BASE_URL}/types`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerType(systemId, data) {
    const res = await fetch(`${BASE_URL}/types/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerType(systemId) {
    const res = await fetch(`${BASE_URL}/types/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerGroups() {
    const res = await fetch(`${BASE_URL}/groups`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCustomerGroup(data) {
    const res = await fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerGroup(systemId, data) {
    const res = await fetch(`${BASE_URL}/groups/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerGroup(systemId) {
    const res = await fetch(`${BASE_URL}/groups/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerSources() {
    const res = await fetch(`${BASE_URL}/sources`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCustomerSource(data) {
    const res = await fetch(`${BASE_URL}/sources`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerSource(systemId, data) {
    const res = await fetch(`${BASE_URL}/sources/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerSource(systemId) {
    const res = await fetch(`${BASE_URL}/sources/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchPaymentTerms() {
    const res = await fetch(`${BASE_URL}/payment-terms`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createPaymentTerm(data) {
    const res = await fetch(`${BASE_URL}/payment-terms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updatePaymentTerm(systemId, data) {
    const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deletePaymentTerm(systemId) {
    const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCreditRatings() {
    const res = await fetch(`${BASE_URL}/credit-ratings`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCreditRating(data) {
    const res = await fetch(`${BASE_URL}/credit-ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCreditRating(systemId, data) {
    const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCreditRating(systemId) {
    const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchLifecycleStages() {
    const res = await fetch(`${BASE_URL}/lifecycle-stages`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createLifecycleStage(data) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateLifecycleStage(systemId, data) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteLifecycleStage(systemId) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerSlaSettings() {
    const res = await fetch(`${BASE_URL}/sla-settings`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function updateCustomerSlaSetting(systemId, data) {
    const res = await fetch(`${BASE_URL}/sla-settings/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
}),
"[project]/features/settings/customers/hooks/use-customer-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "customerSettingsKeys",
    ()=>customerSettingsKeys,
    "useCreditRatingMutations",
    ()=>useCreditRatingMutations,
    "useCreditRatings",
    ()=>useCreditRatings,
    "useCustomerGroupMutations",
    ()=>useCustomerGroupMutations,
    "useCustomerGroups",
    ()=>useCustomerGroups,
    "useCustomerSlaSettingMutations",
    ()=>useCustomerSlaSettingMutations,
    "useCustomerSlaSettings",
    ()=>useCustomerSlaSettings,
    "useCustomerSourceMutations",
    ()=>useCustomerSourceMutations,
    "useCustomerSources",
    ()=>useCustomerSources,
    "useCustomerTypeMutations",
    ()=>useCustomerTypeMutations,
    "useCustomerTypes",
    ()=>useCustomerTypes,
    "useLifecycleStageMutations",
    ()=>useLifecycleStageMutations,
    "useLifecycleStages",
    ()=>useLifecycleStages,
    "usePaymentTermMutations",
    ()=>usePaymentTermMutations,
    "usePaymentTerms",
    ()=>usePaymentTerms
]);
/**
 * Customer Settings React Query Hooks
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/api/customer-settings-api.ts [app-ssr] (ecmascript)");
;
;
const customerSettingsKeys = {
    all: [
        'customer-settings'
    ],
    types: ()=>[
            ...customerSettingsKeys.all,
            'types'
        ],
    groups: ()=>[
            ...customerSettingsKeys.all,
            'groups'
        ],
    sources: ()=>[
            ...customerSettingsKeys.all,
            'sources'
        ],
    paymentTerms: ()=>[
            ...customerSettingsKeys.all,
            'payment-terms'
        ],
    creditRatings: ()=>[
            ...customerSettingsKeys.all,
            'credit-ratings'
        ],
    lifecycleStages: ()=>[
            ...customerSettingsKeys.all,
            'lifecycle-stages'
        ],
    slaSettings: ()=>[
            ...customerSettingsKeys.all,
            'sla-settings'
        ]
};
function useCustomerTypes() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.types(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerTypes"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerTypeMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.types()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCustomerType"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerType"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCustomerType"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCustomerGroups() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.groups(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerGroups"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerGroupMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.groups()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCustomerGroup"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerGroup"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCustomerGroup"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCustomerSources() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.sources(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerSources"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerSourceMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.sources()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCustomerSource"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerSource"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCustomerSource"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function usePaymentTerms() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.paymentTerms(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPaymentTerms"],
        staleTime: 1000 * 60 * 10
    });
}
function usePaymentTermMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.paymentTerms()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentTerm"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updatePaymentTerm"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deletePaymentTerm"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCreditRatings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.creditRatings(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCreditRatings"],
        staleTime: 1000 * 60 * 10
    });
}
function useCreditRatingMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.creditRatings()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreditRating"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCreditRating"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCreditRating"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useLifecycleStages() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.lifecycleStages(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLifecycleStages"],
        staleTime: 1000 * 60 * 10
    });
}
function useLifecycleStageMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.lifecycleStages()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLifecycleStage"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLifecycleStage"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteLifecycleStage"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCustomerSlaSettings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.slaSettings(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerSlaSettings"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerSlaSettingMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.slaSettings()
        });
    return {
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerSlaSetting"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
}),
"[project]/features/settings/customers/hooks/use-all-customer-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActiveCreditRatings",
    ()=>useActiveCreditRatings,
    "useActiveCustomerGroups",
    ()=>useActiveCustomerGroups,
    "useActiveCustomerSources",
    ()=>useActiveCustomerSources,
    "useActiveCustomerTypes",
    ()=>useActiveCustomerTypes,
    "useActiveLifecycleStages",
    ()=>useActiveLifecycleStages,
    "useActivePaymentTerms",
    ()=>useActivePaymentTerms,
    "useAllCreditRatings",
    ()=>useAllCreditRatings,
    "useAllCustomerGroups",
    ()=>useAllCustomerGroups,
    "useAllCustomerSources",
    ()=>useAllCustomerSources,
    "useAllCustomerTypes",
    ()=>useAllCustomerTypes,
    "useAllLifecycleStages",
    ()=>useAllLifecycleStages,
    "useAllPaymentTerms",
    ()=>useAllPaymentTerms,
    "useCreditRatingFinder",
    ()=>useCreditRatingFinder,
    "useCustomerGroupFinder",
    ()=>useCustomerGroupFinder,
    "useCustomerGroupOptions",
    ()=>useCustomerGroupOptions,
    "useCustomerSourceFinder",
    ()=>useCustomerSourceFinder,
    "useCustomerSourceOptions",
    ()=>useCustomerSourceOptions,
    "useCustomerTypeFinder",
    ()=>useCustomerTypeFinder,
    "useCustomerTypeOptions",
    ()=>useCustomerTypeOptions,
    "useLifecycleStageFinder",
    ()=>useLifecycleStageFinder,
    "usePaymentTermFinder",
    ()=>usePaymentTermFinder
]);
/**
 * Convenience hooks for customer settings - flat array access
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/hooks/use-customer-settings.ts [app-ssr] (ecmascript)");
;
;
function useAllCustomerTypes() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerTypes"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveCustomerTypes() {
    const { data, isLoading, isError, error } = useAllCustomerTypes();
    const activeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>data.filter((t)=>!t.isDeleted && t.isActive !== false), [
        data
    ]);
    return {
        data: activeData,
        isLoading,
        isError,
        error
    };
}
function useCustomerTypeOptions() {
    const { data, isLoading } = useAllCustomerTypes();
    const options = data.map((t)=>({
            value: t.systemId,
            label: t.name
        }));
    return {
        options,
        isLoading
    };
}
function useCustomerTypeFinder() {
    const { data } = useAllCustomerTypes();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((t)=>t.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useAllCustomerGroups() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerGroups"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveCustomerGroups() {
    const { data, isLoading, isError, error } = useAllCustomerGroups();
    const activeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>data.filter((g)=>!g.isDeleted && g.isActive !== false), [
        data
    ]);
    return {
        data: activeData,
        isLoading,
        isError,
        error
    };
}
function useCustomerGroupOptions() {
    const { data, isLoading } = useAllCustomerGroups();
    const options = data.map((g)=>({
            value: g.systemId,
            label: g.name
        }));
    return {
        options,
        isLoading
    };
}
function useAllCustomerSources() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSources"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveCustomerSources() {
    const { data, isLoading, isError, error } = useAllCustomerSources();
    const activeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>data.filter((s)=>!s.isDeleted && s.isActive !== false), [
        data
    ]);
    return {
        data: activeData,
        isLoading,
        isError,
        error
    };
}
function useCustomerSourceOptions() {
    const { data, isLoading } = useAllCustomerSources();
    const options = data.map((s)=>({
            value: s.systemId,
            label: s.name
        }));
    return {
        options,
        isLoading
    };
}
function useCustomerGroupFinder() {
    const { data } = useAllCustomerGroups();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((g)=>g.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useCustomerSourceFinder() {
    const { data } = useAllCustomerSources();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((s)=>s.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useAllPaymentTerms() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentTerms"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActivePaymentTerms() {
    const { data, isLoading, isError, error } = useAllPaymentTerms();
    const activeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>data.filter((t)=>!t.isDeleted && t.isActive !== false), [
        data
    ]);
    return {
        data: activeData,
        isLoading,
        isError,
        error
    };
}
function usePaymentTermFinder() {
    const { data } = useAllPaymentTerms();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((t)=>t.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useAllCreditRatings() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCreditRatings"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveCreditRatings() {
    const { data, isLoading, isError, error } = useAllCreditRatings();
    const activeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>data.filter((r)=>!r.isDeleted && r.isActive !== false), [
        data
    ]);
    return {
        data: activeData,
        isLoading,
        isError,
        error
    };
}
function useCreditRatingFinder() {
    const { data } = useAllCreditRatings();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((r)=>r.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useAllLifecycleStages() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLifecycleStages"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveLifecycleStages() {
    const { data, isLoading, isError, error } = useAllLifecycleStages();
    const activeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>data.filter((s)=>!s.isDeleted && s.isActive !== false), [
        data
    ]);
    return {
        data: activeData,
        isLoading,
        isError,
        error
    };
}
function useLifecycleStageFinder() {
    const { data } = useAllLifecycleStages();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((s)=>s.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/settings/branches/api/branches-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Branches API functions
 * 
 * ⚠️ Direct import: import { fetchBranches } from '@/features/settings/branches/api/branches-api'
 */ __turbopack_context__.s([
    "createBranch",
    ()=>createBranch,
    "deleteBranch",
    ()=>deleteBranch,
    "fetchBranch",
    ()=>fetchBranch,
    "fetchBranches",
    ()=>fetchBranches,
    "setDefaultBranch",
    ()=>setDefaultBranch,
    "updateBranch",
    ()=>updateBranch
]);
const BASE_URL = '/api/branches';
async function fetchBranches(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.isDefault !== undefined) searchParams.set('isDefault', String(params.isDefault));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.statusText}`);
    }
    return response.json();
}
async function fetchBranch(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch branch: ${response.statusText}`);
    }
    return response.json();
}
async function createBranch(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create branch');
    }
    return response.json();
}
async function updateBranch(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update branch');
    }
    return response.json();
}
async function deleteBranch(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete branch: ${response.statusText}`);
    }
}
async function setDefaultBranch(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/set-default`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to set default branch');
    }
    return response.json();
}
}),
"[project]/features/settings/branches/hooks/use-branches.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "branchKeys",
    ()=>branchKeys,
    "useBranch",
    ()=>useBranch,
    "useBranchMutations",
    ()=>useBranchMutations,
    "useBranches",
    ()=>useBranches,
    "useDefaultBranch",
    ()=>useDefaultBranch
]);
/**
 * useBranches - React Query hooks
 * 
 * ⚠️ Direct import: import { useBranches } from '@/features/settings/branches/hooks/use-branches'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/api/branches-api.ts [app-ssr] (ecmascript)");
;
;
const branchKeys = {
    all: [
        'branches'
    ],
    lists: ()=>[
            ...branchKeys.all,
            'list'
        ],
    list: (params)=>[
            ...branchKeys.lists(),
            params
        ],
    details: ()=>[
            ...branchKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...branchKeys.details(),
            id
        ]
};
function useBranches(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBranches"])(params),
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useBranch(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBranch"])(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000
    });
}
function useBranchMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBranch"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.all
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBranch"])(systemId, data),
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: branchKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteBranch"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.all
            });
            options.onDeleteSuccess?.();
        },
        onError: options.onError
    });
    const makeDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDefaultBranch"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.all
            });
            options.onSetDefaultSuccess?.(data);
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        makeDefault
    };
}
function useDefaultBranch() {
    const { data, ...rest } = useBranches({
        isDefault: true,
        limit: 1
    });
    return {
        ...rest,
        data: data?.data?.[0] ?? null
    };
}
}),
"[project]/features/settings/branches/hooks/use-all-branches.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllBranches",
    ()=>useAllBranches,
    "useBranchFinder",
    ()=>useBranchFinder,
    "useBranchOptions",
    ()=>useBranchOptions,
    "useDefaultBranch",
    ()=>useDefaultBranch
]);
/**
 * useAllBranches - Convenience hook for components needing all branches as flat array
 * 
 * Use case: Dropdowns, selects that need branch options
 * 
 * ⚠️ For paginated views, use useBranches() instead
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-branches.ts [app-ssr] (ecmascript)");
;
;
function useAllBranches() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBranches"])({
        limit: 100
    });
    return {
        // Cast to Branch[] - API returns string systemId, but we trust the data structure
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useBranchOptions() {
    const { data, isLoading } = useAllBranches();
    const options = data.map((b)=>({
            value: b.systemId,
            label: b.name
        }));
    return {
        options,
        isLoading
    };
}
function useDefaultBranch() {
    const { data, isLoading } = useAllBranches();
    const defaultBranch = data.find((b)=>b.isDefault) || data[0];
    return {
        defaultBranch,
        isLoading
    };
}
function useBranchFinder() {
    const { data } = useAllBranches();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((b)=>b.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/customers/sla/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SLA_ACKNOWLEDGEMENTS_KEY",
    ()=>SLA_ACKNOWLEDGEMENTS_KEY,
    "SLA_EVALUATION_KEY",
    ()=>SLA_EVALUATION_KEY,
    "SLA_LAST_RUN_KEY",
    ()=>SLA_LAST_RUN_KEY,
    "SLA_TYPE_BADGES",
    ()=>SLA_TYPE_BADGES
]);
const SLA_EVALUATION_KEY = 'hrm-customer-sla-evals';
const SLA_ACKNOWLEDGEMENTS_KEY = 'hrm-customer-sla-acks';
const SLA_LAST_RUN_KEY = 'hrm-customer-sla-last-run';
const SLA_TYPE_BADGES = {
    'follow-up': {
        label: 'Liên hệ định kỳ',
        color: 'text-blue-600 bg-blue-50'
    },
    're-engagement': {
        label: 'Kích hoạt lại',
        color: 'text-orange-600 bg-orange-50'
    },
    'debt-payment': {
        label: 'Nhắc công nợ',
        color: 'text-rose-600 bg-rose-50'
    }
};
}),
"[project]/features/reports/customer-sla-report/sla-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateAlertLevel",
    ()=>calculateAlertLevel,
    "calculateReportSummary",
    ()=>calculateReportSummary,
    "formatDaysRemaining",
    ()=>formatDaysRemaining,
    "getAlertBadgeVariant",
    ()=>getAlertBadgeVariant,
    "getAlertLevelColor",
    ()=>getAlertLevelColor,
    "getDebtAlerts",
    ()=>getDebtAlerts,
    "getFollowUpAlerts",
    ()=>getFollowUpAlerts,
    "getHealthAlerts",
    ()=>getHealthAlerts,
    "getReEngagementAlerts",
    ()=>getReEngagementAlerts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInDays.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
;
function calculateAlertLevel(daysRemaining, slaSetting) {
    if (daysRemaining < -slaSetting.criticalDays) return 'overdue'; // Quá hạn > criticalDays ngày
    if (daysRemaining < 0) return 'critical'; // Quá hạn nhưng chưa đến criticalDays
    if (daysRemaining <= slaSetting.warningDays) return 'warning'; // Còn <= warningDays ngày
    return 'normal';
}
function getFollowUpAlerts(customers, slaSettings) {
    // Simplified: only 1 SLA per type
    const followUpSla = slaSettings.find((s)=>s.slaType === 'follow-up' && s.isActive);
    if (!followUpSla) return [];
    const today = new Date();
    const alerts = [];
    for (const customer of customers){
        if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;
        // Lấy ngày liên hệ cuối (dựa trên lastPurchaseDate hoặc updatedAt)
        const lastContactDate = customer.lastPurchaseDate || customer.updatedAt || customer.createdAt;
        if (!lastContactDate) continue;
        const lastContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(lastContactDate);
        const daysSinceContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])(today, lastContact);
        const daysRemaining = followUpSla.targetDays - daysSinceContact;
        // Hiển thị alert khi còn <= warningDays ngày hoặc đã quá hạn
        if (daysRemaining <= followUpSla.warningDays) {
            alerts.push({
                systemId: customer.systemId,
                customer,
                slaType: 'follow-up',
                slaName: followUpSla.name,
                daysRemaining,
                alertLevel: calculateAlertLevel(daysRemaining, followUpSla),
                targetDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(lastContact.getTime() + followUpSla.targetDays * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                lastActivityDate: lastContactDate,
                ...customer.accountManagerName ? {
                    assignee: customer.accountManagerName
                } : {}
            });
        }
    }
    return alerts.sort((a, b)=>a.daysRemaining - b.daysRemaining);
}
function getReEngagementAlerts(customers, slaSettings) {
    // Simplified: only 1 SLA per type
    const reEngageSla = slaSettings.find((s)=>s.slaType === 're-engagement' && s.isActive);
    if (!reEngageSla) return [];
    const today = new Date();
    const alerts = [];
    for (const customer of customers){
        if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;
        // Chỉ xét khách đã từng mua hàng
        if (!customer.lastPurchaseDate || !customer.totalOrders) continue;
        const lastPurchase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(customer.lastPurchaseDate);
        const daysSincePurchase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])(today, lastPurchase);
        const daysRemaining = reEngageSla.targetDays - daysSincePurchase;
        // Hiển thị alert khi còn <= warningDays ngày hoặc đã quá hạn
        if (daysRemaining <= reEngageSla.warningDays) {
            alerts.push({
                systemId: customer.systemId,
                customer,
                slaType: 're-engagement',
                slaName: reEngageSla.name,
                daysRemaining,
                alertLevel: calculateAlertLevel(daysRemaining, reEngageSla),
                targetDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(lastPurchase.getTime() + reEngageSla.targetDays * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                lastActivityDate: customer.lastPurchaseDate,
                ...customer.accountManagerName ? {
                    assignee: customer.accountManagerName
                } : {}
            });
        }
    }
    return alerts.sort((a, b)=>a.daysRemaining - b.daysRemaining);
}
function getDebtAlerts(customers) {
    const alerts = [];
    for (const customer of customers){
        if (customer.isDeleted) continue;
        // Chỉ xét khách có công nợ
        const currentDebt = customer.currentDebt || 0;
        if (currentDebt <= 0) continue;
        // Tính số tiền quá hạn và ngày quá hạn
        let overdueAmount = 0;
        let maxDaysOverdue = 0;
        let oldestDueDate;
        if (customer.debtTransactions) {
            const today = new Date();
            for (const txn of customer.debtTransactions){
                if (txn.isPaid) continue;
                const dueDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(txn.dueDate);
                const daysOverdue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])(today, dueDate);
                if (daysOverdue > 0) {
                    overdueAmount += txn.remainingAmount || txn.amount;
                    if (daysOverdue > maxDaysOverdue) {
                        maxDaysOverdue = daysOverdue;
                        oldestDueDate = txn.dueDate;
                    }
                }
            }
        }
        // Lấy debtStatus từ customer hoặc tính toán
        const debtStatus = customer.debtStatus || 'Chưa đến hạn';
        // Chỉ hiển thị nếu có nợ quá hạn hoặc sắp đến hạn
        if (overdueAmount > 0 || debtStatus !== 'Chưa đến hạn') {
            alerts.push({
                systemId: customer.systemId,
                customer,
                totalDebt: currentDebt,
                overdueAmount,
                daysOverdue: maxDaysOverdue,
                debtStatus,
                ...oldestDueDate ? {
                    oldestDueDate
                } : {}
            });
        }
    }
    return alerts.sort((a, b)=>b.daysOverdue - a.daysOverdue);
}
function getHealthAlerts(customers) {
    const today = new Date();
    const alerts = [];
    for (const customer of customers){
        if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;
        const healthScore = customer.healthScore || 50;
        const churnRisk = customer.churnRisk || 'low';
        // Chỉ hiển thị nếu có rủi ro medium hoặc high, hoặc health score < 50
        if (churnRisk !== 'low' || healthScore < 50) {
            const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])(today, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(customer.lastPurchaseDate)) : 999;
            alerts.push({
                systemId: customer.systemId,
                customer,
                healthScore,
                churnRisk,
                ...customer.segment ? {
                    segment: customer.segment
                } : {},
                daysSinceLastPurchase,
                totalOrders: customer.totalOrders || 0,
                totalSpent: customer.totalSpent || 0
            });
        }
    }
    return alerts.sort((a, b)=>a.healthScore - b.healthScore);
}
function calculateReportSummary(customers, slaSettings) {
    const followUpAlerts = getFollowUpAlerts(customers, slaSettings);
    const reEngagementAlerts = getReEngagementAlerts(customers, slaSettings);
    const debtAlerts = getDebtAlerts(customers);
    const healthAlerts = getHealthAlerts(customers);
    const criticalCount = followUpAlerts.filter((a)=>a.alertLevel === 'critical' || a.alertLevel === 'overdue').length + reEngagementAlerts.filter((a)=>a.alertLevel === 'critical' || a.alertLevel === 'overdue').length + debtAlerts.filter((a)=>a.daysOverdue > 15).length + healthAlerts.filter((a)=>a.churnRisk === 'high').length;
    return {
        totalCustomers: customers.filter((c)=>!c.isDeleted).length,
        followUpAlerts: followUpAlerts.length,
        reEngagementAlerts: reEngagementAlerts.length,
        debtAlerts: debtAlerts.length,
        healthAlerts: healthAlerts.length,
        criticalCount
    };
}
function formatDaysRemaining(days) {
    if (days < 0) return `Quá ${Math.abs(days)} ngày`;
    if (days === 0) return 'Hôm nay';
    return `Còn ${days} ngày`;
}
function getAlertLevelColor(level) {
    switch(level){
        case 'overdue':
            return 'text-red-600 bg-red-50';
        case 'critical':
            return 'text-orange-600 bg-orange-50';
        case 'warning':
            return 'text-yellow-600 bg-yellow-50';
        default:
            return 'text-green-600 bg-green-50';
    }
}
function getAlertBadgeVariant(level) {
    switch(level){
        case 'overdue':
            return 'destructive';
        case 'critical':
            return 'warning';
        case 'warning':
            return 'default';
        default:
            return 'secondary';
    }
}
}),
"[project]/features/customers/columns.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/lifecycle-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/credit-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/intelligence-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/debt-tracking-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/progress.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$reports$2f$customer$2d$sla$2d$report$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/reports/customer-sla-report/sla-utils.ts [app-ssr] (ecmascript)");
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
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};
const getColumns = (onDelete, onRestore, router, options)=>[
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                    onCheckedChange: (value)=>onToggleAll?.(!!value),
                    "aria-label": "Select all"
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: onToggleSelect,
                    "aria-label": "Select row"
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                // FIX: Added missing 'displayName' property to satisfy the ColumnDef type.
                displayName: "Select",
                sticky: "left"
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Mã KH",
                    sortKey: "id",
                    isSorted: sorting?.id === 'id',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'id',
                                desc: s.id === 'id' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 74,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-medium",
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 82,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Mã KH"
            },
            size: 100
        },
        {
            id: "name",
            accessorKey: "name",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Tên khách hàng",
                    sortKey: "name",
                    isSorted: sorting?.id === 'name',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'name',
                                desc: s.id === 'name' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 92,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>row.name,
            meta: {
                displayName: "Tên khách hàng"
            }
        },
        {
            id: "email",
            accessorKey: "email",
            header: "Email",
            cell: ({ row })=>row.email,
            meta: {
                displayName: "Email"
            }
        },
        {
            id: "phone",
            accessorKey: "phone",
            header: "Số điện thoại",
            cell: ({ row })=>row.phone,
            meta: {
                displayName: "Số điện thoại"
            }
        },
        {
            id: "company",
            accessorKey: "company",
            header: "Công ty",
            cell: ({ row })=>row.company || '—',
            meta: {
                displayName: "Công ty"
            }
        },
        {
            id: "type",
            accessorKey: "type",
            header: "Loại KH",
            cell: ({ row })=>{
                if (!row.type) return '—';
                const variant = row.type === 'Cá nhân' ? 'secondary' : 'default';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: variant,
                    children: row.type
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 137,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Loại khách hàng"
            }
        },
        {
            id: "accountManagerName",
            accessorKey: "accountManagerName",
            header: "NV phụ trách",
            cell: ({ row })=>row.accountManagerName || '—',
            meta: {
                displayName: "NV phụ trách"
            }
        },
        {
            id: "currentDebt",
            accessorKey: "currentDebt",
            header: "Công nợ",
            cell: ({ row })=>{
                const alertLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCreditAlertLevel"])(row);
                const showAlert = alertLevel === 'warning' || alertLevel === 'danger' || alertLevel === 'exceeded';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: formatCurrency(row.currentDebt)
                        }, void 0, false, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        showAlert && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCreditAlertBadgeVariant"])(alertLevel),
                            className: "gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "h-3 w-3"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/columns.tsx",
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCreditAlertText"])(alertLevel)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Công nợ hiện tại"
            }
        },
        {
            id: "debtStatus",
            accessorKey: "debtStatus",
            header: "Trạng thái công nợ",
            cell: ({ row })=>{
                const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateDebtTrackingInfo"])(row);
                if (!row.currentDebt || row.currentDebt === 0 || !info.debtStatus) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "outline",
                        children: "Không có công nợ"
                    }, void 0, false, {
                        fileName: "[project]/features/customers/columns.tsx",
                        lineNumber: 178,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDebtStatusVariant"])(info.debtStatus),
                            children: [
                                info.debtStatus,
                                info.maxDaysOverdue > 0 && ` (${info.maxDaysOverdue} ngày)`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 183,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        info.oldestDebtDueDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-xs text-muted-foreground",
                            children: [
                                "Hạn: ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDebtDate"])(info.oldestDebtDueDate)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 188,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Trạng thái công nợ"
            }
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row })=>{
                const status = row.status;
                const variant = status === "Đang giao dịch" ? "success" : "secondary";
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: variant,
                    children: status
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 204,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Trạng thái"
            }
        },
        {
            id: "slaStatus",
            header: "SLA",
            cell: ({ row })=>{
                const entry = options?.slaIndex?.entries[row.systemId];
                if (!entry || !entry.alerts.length) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "outline",
                        className: "text-body-xs text-muted-foreground",
                        children: "Ổn định"
                    }, void 0, false, {
                        fileName: "[project]/features/customers/columns.tsx",
                        lineNumber: 216,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                const alerts = entry.alerts.slice(0, 2);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        alerts.map((alert)=>{
                            const badgeMeta = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLA_TYPE_BADGES"][alert.slaType];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "outline",
                                        className: "text-[11px]",
                                        children: badgeMeta?.label || alert.slaName
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/columns.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$reports$2f$customer$2d$sla$2d$report$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAlertBadgeVariant"])(alert.alertLevel),
                                        className: "text-[11px]",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$reports$2f$customer$2d$sla$2d$report$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDaysRemaining"])(alert.daysRemaining)
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/columns.tsx",
                                        lineNumber: 229,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, `${alert.slaType}-${alert.targetDate}`, true, {
                                fileName: "[project]/features/customers/columns.tsx",
                                lineNumber: 225,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0));
                        }),
                        entry.alerts.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[11px] text-muted-foreground",
                            children: [
                                "+",
                                entry.alerts.length - 2,
                                " cảnh báo khác"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "SLA"
            },
            size: 220
        },
        {
            id: "lifecycleStage",
            header: "Giai đoạn",
            cell: ({ row })=>{
                const stage = row.lifecycleStage || (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(row);
                const variant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLifecycleStageVariant"])(stage);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: variant,
                    children: stage
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 252,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Giai đoạn KH"
            }
        },
        {
            id: "healthScore",
            header: "Health Score",
            cell: ({ row })=>{
                const score = row.healthScore || (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(row);
                const { label, variant } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHealthScoreLevel"])(score);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-16",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Progress"], {
                                value: score,
                                className: "h-2"
                            }, void 0, false, {
                                fileName: "[project]/features/customers/columns.tsx",
                                lineNumber: 267,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 266,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-sm font-medium",
                            children: score
                        }, void 0, false, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 269,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: variant,
                            className: "text-body-xs",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 270,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 265,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Điểm sức khỏe KH"
            },
            size: 200
        },
        {
            id: "churnRisk",
            header: "Rủi ro rời bỏ",
            cell: ({ row })=>{
                const churn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(row);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: churn.variant,
                    children: churn.label
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 284,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Rủi ro rời bỏ"
            },
            size: 120
        },
        {
            id: "segment",
            header: "Phân khúc",
            cell: ({ row })=>{
                // Sử dụng rfmScores đã lưu sẵn hoặc tính đơn giản nếu chưa có
                if (row.segment) {
                    const segment = row.segment;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSegmentBadgeVariant"])(segment),
                        className: "text-body-xs",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSegmentLabel"])(segment)
                    }, void 0, false, {
                        fileName: "[project]/features/customers/columns.tsx",
                        lineNumber: 299,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                // Fallback: hiển thị dựa trên rfmScores nếu có
                if (row.rfmScores) {
                    const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerSegment"])(row.rfmScores);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSegmentBadgeVariant"])(segment),
                        className: "text-body-xs",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSegmentLabel"])(segment)
                    }, void 0, false, {
                        fileName: "[project]/features/customers/columns.tsx",
                        lineNumber: 308,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-xs text-muted-foreground",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 313,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Phân khúc RFM"
            },
            size: 120
        },
        {
            id: "taxCode",
            accessorKey: "taxCode",
            header: "Mã số thuế",
            cell: ({ row })=>row.taxCode,
            meta: {
                displayName: "Mã số thuế"
            }
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: "Ngày khởi tạo",
            cell: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.createdAt),
            meta: {
                displayName: "Ngày khởi tạo"
            }
        },
        {
            id: "totalOrders",
            accessorKey: "totalOrders",
            header: "Tổng đơn",
            cell: ({ row })=>row.totalOrders,
            meta: {
                displayName: "Tổng SL đơn hàng"
            }
        },
        {
            id: "totalSpent",
            accessorKey: "totalSpent",
            header: "Tổng chi tiêu",
            cell: ({ row })=>formatCurrency(row.totalSpent),
            meta: {
                displayName: "Tổng chi tiêu"
            }
        },
        {
            id: "lastPurchaseDate",
            accessorKey: "lastPurchaseDate",
            header: "Mua gần nhất",
            cell: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.lastPurchaseDate),
            meta: {
                displayName: "Ngày cuối cùng mua hàng"
            }
        },
        {
            id: "daysSinceLastPurchase",
            header: "Mua lần cuối",
            cell: ({ row })=>{
                if (!row.lastPurchaseDate) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: "Chưa mua"
                }, void 0, false, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 359,
                    columnNumber: 41
                }, ("TURBOPACK compile-time value", void 0));
                const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(row.lastPurchaseDate));
                // Color coding based on recency
                let colorClass = 'text-foreground';
                if (days > 180) colorClass = 'text-destructive';
                else if (days > 90) colorClass = 'text-orange-600';
                else if (days > 30) colorClass = 'text-yellow-600';
                else colorClass = 'text-green-600';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: colorClass,
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.lastPurchaseDate)
                        }, void 0, false, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 372,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-xs text-muted-foreground",
                            children: [
                                days,
                                " ngày trước"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 371,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Mua lần cuối"
            }
        },
        {
            id: "debtRatio",
            header: "Công nợ/Hạn mức",
            cell: ({ row })=>{
                if (!row.maxDebt || row.maxDebt === 0) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-body-xs",
                        children: "Chưa cấp hạn mức"
                    }, void 0, false, {
                        fileName: "[project]/features/customers/columns.tsx",
                        lineNumber: 384,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                const currentDebt = row.currentDebt || 0;
                const ratio = currentDebt / row.maxDebt * 100;
                // Color based on ratio
                let variant = 'default';
                if (ratio >= 90) variant = 'destructive';
                else if (ratio >= 70) variant = 'warning';
                else variant = 'success';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 min-w-[180px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Progress"], {
                            value: ratio,
                            className: `w-20 h-2 ${variant === 'destructive' ? 'bg-red-100' : variant === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`
                        }, void 0, false, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 398,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-xs font-medium tabular-nums",
                            children: [
                                ratio.toFixed(0),
                                "%"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 399,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-xs text-muted-foreground",
                            children: [
                                formatCurrency(currentDebt),
                                "/",
                                formatCurrency(row.maxDebt)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 400,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 397,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Tỷ lệ công nợ/Hạn mức"
            },
            size: 250
        },
        {
            id: "actions",
            header: ()=>"Hành động",
            cell: ({ row })=>{
                // ✅ Show restore button for deleted items
                if (row.deletedAt) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        onClick: ()=>onRestore(row.systemId),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/features/customers/columns.tsx",
                                lineNumber: 421,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Khôi phục"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/customers/columns.tsx",
                        lineNumber: 416,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0));
                }
                // ✅ Show dropdown menu only
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                className: "h-8 w-8 p-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Mở menu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/columns.tsx",
                                        lineNumber: 432,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/columns.tsx",
                                        lineNumber: 433,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/customers/columns.tsx",
                                lineNumber: 431,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 430,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onSelect: ()=>router.push(`/customers/${row.systemId}/edit`),
                                    children: "Sửa"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/columns.tsx",
                                    lineNumber: 437,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    className: "text-destructive",
                                    onSelect: ()=>onDelete(row.systemId),
                                    children: "Chuyển vào thùng rác"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/columns.tsx",
                                    lineNumber: 438,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/columns.tsx",
                            lineNumber: 436,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/columns.tsx",
                    lineNumber: 429,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Hành động",
                sticky: "right"
            },
            size: 80
        }
    ];
}),
"[project]/features/customers/sla/evaluator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSlaIndex",
    ()=>buildSlaIndex,
    "summarizeIndex",
    ()=>summarizeIndex
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInDays.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatISO.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/intelligence-utils.ts [app-ssr] (ecmascript)");
;
;
const MIN_DATE = '1970-01-01T00:00:00Z';
function calculateAlertLevel(daysRemaining, slaSetting) {
    // daysRemaining < 0 means overdue
    // criticalDays = số ngày quá hạn để coi là nghiêm trọng
    // warningDays = số ngày TRƯỚC target để bắt đầu cảnh báo
    if (daysRemaining < -slaSetting.criticalDays) return 'overdue'; // Quá hạn > criticalDays ngày
    if (daysRemaining < 0) return 'critical'; // Quá hạn nhưng chưa đến criticalDays
    if (daysRemaining <= slaSetting.warningDays) return 'warning'; // Còn <= warningDays ngày
    return 'normal';
}
function addDays(base, days) {
    return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}
function resolveBaselineDate(customer, slaType) {
    switch(slaType){
        case 'follow-up':
            return customer.lastContactDate || customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
        case 're-engagement':
            return customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
        case 'debt-payment':
            return customer.oldestDebtDueDate || customer.updatedAt || customer.createdAt || MIN_DATE;
    }
}
function getAssignee(customer, slaType) {
    if (customer.accountManagerName) return customer.accountManagerName;
    if (customer.accountManagerId) return customer.accountManagerId;
    if (slaType === 'debt-payment') return 'Kế toán công nợ';
    return 'Chưa phân công';
}
function _getLastActivity(customer, slaType) {
    if (slaType === 'debt-payment') {
        return customer.oldestDebtDueDate || customer.updatedAt || customer.createdAt || MIN_DATE;
    }
    if (slaType === 'follow-up') {
        return customer.lastContactDate || customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
    }
    return customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
}
function evaluateSla(customers, slaSettings, slaType) {
    const setting = slaSettings.find((s)=>s.slaType === slaType && s.isActive);
    if (!setting) return [];
    const today = new Date();
    const alerts = [];
    for (const customer of customers){
        if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;
        const baselineISO = resolveBaselineDate(customer, slaType);
        const baseline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(baselineISO);
        const daysSinceBaseline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])(today, baseline);
        const daysRemaining = setting.targetDays - daysSinceBaseline;
        if (slaType === 're-engagement' && !customer.totalOrders) continue;
        if (slaType === 'debt-payment' && !customer.currentDebt) continue;
        // Hiển thị alert khi:
        // - Còn <= warningDays ngày (sắp đến hạn)
        // - Hoặc đã quá hạn (daysRemaining < 0)
        if (daysRemaining <= setting.warningDays) {
            alerts.push({
                systemId: customer.systemId,
                customer,
                slaType,
                slaName: setting.name,
                daysRemaining,
                alertLevel: calculateAlertLevel(daysRemaining, setting),
                targetDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatISO"])(addDays(baseline, setting.targetDays), {
                    representation: 'date'
                }),
                lastActivityDate: baselineISO,
                assignee: getAssignee(customer, slaType)
            });
        }
    }
    return alerts.sort((a, b)=>a.daysRemaining - b.daysRemaining);
}
function evaluateDebts(customers) {
    const alerts = [];
    const today = new Date();
    for (const customer of customers){
        if (customer.isDeleted) continue;
        const currentDebt = customer.currentDebt || 0;
        if (currentDebt <= 0) continue;
        let overdueAmount = 0;
        let maxDaysOverdue = 0;
        let oldestDueDate;
        if (customer.debtTransactions) {
            for (const txn of customer.debtTransactions){
                if (txn.isPaid) continue;
                const dueDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(txn.dueDate);
                const daysOverdue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])(today, dueDate);
                if (daysOverdue > 0) {
                    overdueAmount += txn.remainingAmount || txn.amount;
                    if (daysOverdue > maxDaysOverdue) {
                        maxDaysOverdue = daysOverdue;
                        oldestDueDate = txn.dueDate;
                    }
                }
            }
        }
        // ✅ Tính debtStatus realtime thay vì lấy từ dữ liệu cũ
        let debtStatus;
        if (maxDaysOverdue > 30) {
            debtStatus = 'Quá hạn > 30 ngày';
        } else if (maxDaysOverdue > 15) {
            debtStatus = 'Quá hạn 16-30 ngày';
        } else if (maxDaysOverdue > 7) {
            debtStatus = 'Quá hạn 8-15 ngày';
        } else if (maxDaysOverdue > 0) {
            debtStatus = 'Quá hạn 1-7 ngày';
        } else if (oldestDueDate) {
            const daysUntilDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(oldestDueDate), today);
            if (daysUntilDue <= 0) {
                debtStatus = 'Đến hạn hôm nay';
            } else if (daysUntilDue <= 3) {
                debtStatus = 'Sắp đến hạn';
            } else {
                debtStatus = 'Chưa đến hạn';
            }
        } else {
            debtStatus = customer.debtStatus || 'Chưa đến hạn';
        }
        // ✅ Chỉ hiển thị nếu thực sự có nợ quá hạn (overdueAmount > 0)
        if (overdueAmount > 0) {
            const debtAlert = {
                systemId: customer.systemId,
                customer,
                totalDebt: currentDebt,
                overdueAmount,
                daysOverdue: maxDaysOverdue,
                debtStatus
            };
            if (oldestDueDate !== undefined) {
                debtAlert.oldestDueDate = oldestDueDate;
            }
            alerts.push(debtAlert);
        }
    }
    return alerts.sort((a, b)=>b.daysOverdue - a.daysOverdue);
}
function evaluateHealth(customers) {
    const today = new Date();
    const alerts = [];
    for (const customer of customers){
        if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;
        // ✅ Tính realtime thay vì lấy từ dữ liệu cũ
        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(customer);
        const churnRiskResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(customer);
        const churnRisk = churnRiskResult.risk;
        // Chỉ hiển thị nếu có rủi ro medium/high hoặc health score thấp
        if (churnRisk !== 'low' || healthScore < 50) {
            const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInDays"])(today, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(customer.lastPurchaseDate)) : 999;
            const healthAlert = {
                systemId: customer.systemId,
                customer,
                healthScore,
                churnRisk,
                daysSinceLastPurchase,
                totalOrders: customer.totalOrders || 0,
                totalSpent: customer.totalSpent || 0
            };
            if (customer.segment !== undefined) {
                healthAlert.segment = customer.segment;
            }
            alerts.push(healthAlert);
        }
    }
    return alerts.sort((a, b)=>a.healthScore - b.healthScore);
}
function buildSlaIndex(customers, slaSettings) {
    const followUpAlerts = evaluateSla(customers, slaSettings, 'follow-up');
    const reEngagementAlerts = evaluateSla(customers, slaSettings, 're-engagement');
    const debtAlerts = evaluateDebts(customers);
    const healthAlerts = evaluateHealth(customers);
    const entries = {};
    for (const alert of followUpAlerts){
        entries[alert.systemId] = entries[alert.systemId] || {
            customer: alert.customer,
            alerts: []
        };
        entries[alert.systemId].alerts.push(alert);
    }
    for (const alert of reEngagementAlerts){
        entries[alert.systemId] = entries[alert.systemId] || {
            customer: alert.customer,
            alerts: []
        };
        entries[alert.systemId].alerts.push(alert);
    }
    for (const alert of debtAlerts){
        entries[alert.systemId] = entries[alert.systemId] || {
            customer: alert.customer,
            alerts: []
        };
        entries[alert.systemId].debtAlert = alert;
    }
    for (const alert of healthAlerts){
        entries[alert.systemId] = entries[alert.systemId] || {
            customer: alert.customer,
            alerts: []
        };
        entries[alert.systemId].healthAlert = alert;
    }
    return {
        entries,
        followUpAlerts,
        reEngagementAlerts,
        debtAlerts,
        healthAlerts
    };
}
function summarizeIndex(index) {
    // Count unique customers with critical alerts
    const criticalCustomerIds = new Set();
    index.followUpAlerts.filter((a)=>a.alertLevel === 'critical' || a.alertLevel === 'overdue').forEach((a)=>criticalCustomerIds.add(a.systemId));
    index.reEngagementAlerts.filter((a)=>a.alertLevel === 'critical' || a.alertLevel === 'overdue').forEach((a)=>criticalCustomerIds.add(a.systemId));
    index.debtAlerts.filter((a)=>a.daysOverdue > 15).forEach((a)=>criticalCustomerIds.add(a.systemId));
    index.healthAlerts.filter((a)=>a.churnRisk === 'high').forEach((a)=>criticalCustomerIds.add(a.systemId));
    const criticalCount = criticalCustomerIds.size;
    const totalCustomers = Object.keys(index.entries).length;
    return {
        totalCustomers,
        followUpAlerts: index.followUpAlerts.length,
        reEngagementAlerts: index.reEngagementAlerts.length,
        debtAlerts: index.debtAlerts.length,
        healthAlerts: index.healthAlerts.length,
        criticalCount
    };
}
}),
"[project]/features/customers/sla/ack-storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SLA_LOG_UPDATED_EVENT",
    ()=>SLA_LOG_UPDATED_EVENT,
    "addActivityLog",
    ()=>addActivityLog,
    "clearAcknowledgement",
    ()=>clearAcknowledgement,
    "getAcknowledgement",
    ()=>getAcknowledgement,
    "getActivityLogs",
    ()=>getActivityLogs,
    "getActivityLogsAsync",
    ()=>getActivityLogsAsync,
    "getSnoozeRemaining",
    ()=>getSnoozeRemaining,
    "isAlertSnoozed",
    ()=>isAlertSnoozed,
    "setAcknowledgement",
    ()=>setAcknowledgement
]);
/**
 * Customer SLA Acknowledgement Storage
 * 
 * @migrated localStorage → /api/user-preferences
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/constants.ts [app-ssr] (ecmascript)");
;
const SLA_ACTIVITY_LOG_KEY = 'customer-sla-activity-log';
const PREFERENCE_CATEGORY = 'customer-sla';
// In-memory cache
let cachedMap = null;
let cachedActivityLog = null;
let saveTimeout = null;
let activityLogSaveTimeout = null;
// ============================================================================
// API-backed storage functions with debounce
// ============================================================================
async function loadAckMapFromAPI() {
    try {
        const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLA_ACKNOWLEDGEMENTS_KEY"]}`);
        if (response.ok) {
            const data = await response.json();
            return data.value || {};
        }
    } catch (error) {
        console.warn('[customer-sla] Failed to load ack map from API:', error);
    }
    return {};
}
async function saveAckMapToAPI(map) {
    try {
        await fetch('/api/user-preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: PREFERENCE_CATEGORY,
                key: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLA_ACKNOWLEDGEMENTS_KEY"],
                value: map
            })
        });
    } catch (error) {
        console.warn('[customer-sla] Failed to save ack map to API:', error);
    }
}
async function loadActivityLogFromAPI() {
    try {
        const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${SLA_ACTIVITY_LOG_KEY}`);
        if (response.ok) {
            const data = await response.json();
            return data.value || [];
        }
    } catch (error) {
        console.warn('[customer-sla] Failed to load activity log from API:', error);
    }
    return [];
}
async function saveActivityLogToAPI(logs) {
    try {
        // Keep only last 500 entries
        const trimmed = logs.slice(-500);
        await fetch('/api/user-preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: PREFERENCE_CATEGORY,
                key: SLA_ACTIVITY_LOG_KEY,
                value: trimmed
            })
        });
    } catch (error) {
        console.warn('[customer-sla] Failed to save activity log to API:', error);
    }
}
// ============================================================================
// Debounced save functions
// ============================================================================
function debouncedSaveAckMap(map) {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(()=>{
        saveAckMapToAPI(map);
    }, 1000);
}
function debouncedSaveActivityLog(logs) {
    if (activityLogSaveTimeout) clearTimeout(activityLogSaveTimeout);
    activityLogSaveTimeout = setTimeout(()=>{
        saveActivityLogToAPI(logs);
    }, 1000);
}
// ============================================================================
// Initialize cache on first use
// ============================================================================
async function _ensureCache() {
    if (!cachedMap) {
        cachedMap = await loadAckMapFromAPI();
    }
    return cachedMap;
}
async function ensureActivityLogCache() {
    if (!cachedActivityLog) {
        cachedActivityLog = await loadActivityLogFromAPI();
    }
    return cachedActivityLog;
}
// Sync version for immediate reads (uses cached data)
function ensureCacheSync() {
    if (!cachedMap) {
        // Trigger async load but return empty for now
        loadAckMapFromAPI().then((map)=>{
            cachedMap = map;
        });
        return {};
    }
    return cachedMap;
}
function getAcknowledgement(customerId, slaType) {
    const map = ensureCacheSync();
    const ack = map[customerId]?.[slaType];
    // Check if snooze has expired
    if (ack?.snoozeUntil) {
        const snoozeEnd = new Date(ack.snoozeUntil);
        if (snoozeEnd < new Date()) {
            // Snooze expired, remove the acknowledgement
            clearAcknowledgement(customerId, slaType);
            return undefined;
        }
    }
    return ack;
}
function setAcknowledgement(customerId, ack, performedBy) {
    const map = ensureCacheSync();
    map[customerId] = map[customerId] || {};
    map[customerId][ack.slaType] = ack;
    cachedMap = map;
    debouncedSaveAckMap(map);
    // Log activity
    addActivityLog({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerId,
        slaType: ack.slaType,
        actionType: ack.actionType,
        performedAt: ack.acknowledgedAt,
        performedBy,
        notes: ack.notes
    });
}
function clearAcknowledgement(customerId, slaType) {
    const map = ensureCacheSync();
    if (!map[customerId]) return;
    if (slaType) {
        delete map[customerId][slaType];
    } else {
        delete map[customerId];
    }
    cachedMap = map;
    debouncedSaveAckMap(map);
}
const SLA_LOG_UPDATED_EVENT = 'sla-log-updated';
function addActivityLog(log) {
    // Get current cache or initialize empty
    if (!cachedActivityLog) {
        cachedActivityLog = [];
        // Also trigger async load to get existing logs
        ensureActivityLogCache();
    }
    cachedActivityLog.push(log);
    debouncedSaveActivityLog(cachedActivityLog);
    // Dispatch event to notify listeners
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function getActivityLogs(customerId, limit = 50) {
    const logs = cachedActivityLog || [];
    const filtered = customerId ? logs.filter((l)=>l.customerId === customerId) : logs;
    return filtered.slice(-limit).reverse();
}
async function getActivityLogsAsync(customerId, limit = 50) {
    const logs = await ensureActivityLogCache();
    const filtered = customerId ? logs.filter((l)=>l.customerId === customerId) : logs;
    return filtered.slice(-limit).reverse();
}
function isAlertSnoozed(customerId, slaType) {
    const ack = getAcknowledgement(customerId, slaType);
    if (!ack?.snoozeUntil) return false;
    return new Date(ack.snoozeUntil) > new Date();
}
function getSnoozeRemaining(customerId, slaType) {
    const ack = getAcknowledgement(customerId, slaType);
    if (!ack?.snoozeUntil) return 0;
    const remaining = new Date(ack.snoozeUntil).getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24))); // Days remaining
}
}),
"[project]/features/customers/sla/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerSlaEngineStore",
    ()=>useCustomerSlaEngineStore
]);
/**
 * Customer SLA Engine Store
 * 
 * @migrated localStorage → /api/user-preferences for cache
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/evaluator.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$ack$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/ack-storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const PREFERENCE_CATEGORY = 'customer-sla';
// API-backed cache functions
async function loadIndexFromAPI() {
    try {
        const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLA_EVALUATION_KEY"]}`);
        if (response.ok) {
            const data = await response.json();
            return data.value || null;
        }
    } catch (error) {
        console.warn('[customer-sla] Failed to load cached index from API:', error);
    }
    return null;
}
async function loadLastRunFromAPI() {
    try {
        const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLA_LAST_RUN_KEY"]}`);
        if (response.ok) {
            const data = await response.json();
            return data.value || undefined;
        }
    } catch (error) {
        console.warn('[customer-sla] Failed to load last run from API:', error);
    }
    return undefined;
}
let saveTimeout = null;
async function saveIndexToAPI(index, timestamp) {
    // Cancel any pending save
    if (saveTimeout) clearTimeout(saveTimeout);
    // Debounce save to avoid too many API calls
    saveTimeout = setTimeout(async ()=>{
        try {
            await Promise.all([
                fetch('/api/user-preferences', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        category: PREFERENCE_CATEGORY,
                        key: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLA_EVALUATION_KEY"],
                        value: index
                    })
                }),
                fetch('/api/user-preferences', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        category: PREFERENCE_CATEGORY,
                        key: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLA_LAST_RUN_KEY"],
                        value: timestamp
                    })
                })
            ]);
        } catch (error) {
            console.warn('[customer-sla] Failed to cache index to API:', error);
        }
    }, 1000);
}
// Store reference for re-evaluation
let _lastCustomers = [];
let _lastSettings = [];
const useCustomerSlaEngineStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>{
    // Start with empty state, load from API async
    const initialState = {
        index: null,
        summary: null,
        isLoading: true,
        lastEvaluatedAt: undefined
    };
    return {
        ...initialState,
        // Load cached index from API (called on mount)
        async loadCachedIndex () {
            const [cachedIndex, lastRun] = await Promise.all([
                loadIndexFromAPI(),
                loadLastRunFromAPI()
            ]);
            if (cachedIndex) {
                set({
                    index: cachedIndex,
                    summary: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeIndex"])(cachedIndex),
                    lastEvaluatedAt: lastRun,
                    isLoading: false
                });
            } else {
                set({
                    isLoading: false
                });
            }
        },
        evaluate (customers, settings) {
            // Store for re-evaluation
            _lastCustomers = customers;
            _lastSettings = settings;
            set({
                isLoading: true
            });
            const nextIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSlaIndex"])(customers, settings);
            const nextSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeIndex"])(nextIndex);
            const timestamp = new Date().toISOString();
            // Save to API (debounced)
            saveIndexToAPI(nextIndex, timestamp);
            set({
                index: nextIndex,
                summary: nextSummary,
                lastEvaluatedAt: timestamp,
                isLoading: false
            });
        },
        triggerReevaluation () {
            // Get fresh customer data from the customer store
            const freshCustomers = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().data;
            if (freshCustomers.length && _lastSettings.length) {
                get().evaluate(freshCustomers, _lastSettings);
            }
        },
        acknowledge (customerId, alert, options = {}) {
            const { actionType = 'acknowledged', snoozeDays, notes } = options;
            const now = new Date();
            const performedBy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])() || 'Hệ thống';
            const ack = {
                slaType: alert.slaType,
                targetDate: alert.targetDate,
                acknowledgedAt: now.toISOString(),
                actionType,
                notes
            };
            if (snoozeDays && snoozeDays > 0) {
                const snoozeEnd = new Date(now.getTime() + snoozeDays * 24 * 60 * 60 * 1000);
                ack.snoozeUntil = snoozeEnd.toISOString();
                ack.actionType = 'snoozed';
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$ack$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAcknowledgement"])(customerId, ack, performedBy);
            const currentIndex = get().index;
            if (!currentIndex) return;
            // For follow-up SLA, we remove from index because the cycle will be reset
            // (lastContactDate updated -> re-evaluation will create new alert with new targetDate)
            // For other SLA types, we keep the alert visible with "acknowledged" badge
            if (alert.slaType === 'follow-up') {
                const nextEntries = {
                    ...currentIndex.entries
                };
                const entry = nextEntries[customerId];
                if (entry) {
                    entry.alerts = entry.alerts.filter((a)=>!(a.slaType === alert.slaType && a.targetDate === alert.targetDate));
                }
                const nextIndex = {
                    ...currentIndex,
                    entries: nextEntries,
                    followUpAlerts: currentIndex.followUpAlerts.filter((a)=>!(a.systemId === customerId && a.slaType === alert.slaType && a.targetDate === alert.targetDate))
                };
                const nextSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeIndex"])(nextIndex);
                set({
                    index: nextIndex,
                    summary: nextSummary
                });
            } else {
                // For re-engagement, debt-payment - just trigger a re-render
                // Alert stays visible with "acknowledged" badge
                // Create new summary object to ensure reference change
                const newSummary = {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeIndex"])(currentIndex),
                    _lastAckAt: now.toISOString()
                };
                set({
                    summary: newSummary
                });
            }
        },
        snooze (customerId, alert, days, notes) {
            get().acknowledge(customerId, alert, {
                actionType: 'snoozed',
                snoozeDays: days,
                notes: notes || `Tạm ẩn ${days} ngày`
            });
        },
        getAck (customerId, slaType) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$ack$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAcknowledgement"])(customerId, slaType);
        },
        isSnoozed (customerId, slaType) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$ack$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAlertSnoozed"])(customerId, slaType);
        },
        getSnoozeRemaining (customerId, slaType) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$ack$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSnoozeRemaining"])(customerId, slaType);
        }
    };
});
}),
"[project]/features/customers/customer-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_CUSTOMER_SORT",
    ()=>DEFAULT_CUSTOMER_SORT,
    "fetchCustomersPage",
    ()=>fetchCustomersPage,
    "getFilteredCustomersSnapshot",
    ()=>getFilteredCustomersSnapshot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/store.ts [app-ssr] (ecmascript)");
;
;
;
;
const DEFAULT_CUSTOMER_SORT = {
    id: 'createdAt',
    desc: true
};
const fuseOptions = {
    keys: [
        'name',
        'email',
        'phone',
        'company',
        'taxCode',
        'id'
    ],
    threshold: 0.3
};
function applyFilters(customers, params) {
    const { search, statusFilter, typeFilter, dateRange, showDeleted, sorting, slaFilter, debtFilter } = params;
    let dataset = customers.filter((customer)=>showDeleted ? !!customer.isDeleted : !customer.isDeleted);
    if (statusFilter !== 'all') {
        dataset = dataset.filter((customer)=>customer.status === statusFilter);
    }
    if (typeFilter !== 'all') {
        dataset = dataset.filter((customer)=>customer.type === typeFilter);
    }
    if (dateRange && (dateRange[0] || dateRange[1])) {
        dataset = dataset.filter((customer)=>{
            if (!customer.createdAt) return false;
            const createdDate = new Date(customer.createdAt);
            const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
            const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
            if (fromDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateBefore"])(createdDate, fromDate)) return false;
            if (toDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(createdDate, toDate)) return false;
            return true;
        });
    }
    // Apply SLA filter
    if (slaFilter !== 'all') {
        const slaIndex = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSlaEngineStore"].getState().index;
        if (slaIndex) {
            const relevantSystemIds = new Set();
            if (slaFilter === 'followUp') {
                slaIndex.followUpAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            } else if (slaFilter === 'reengage') {
                slaIndex.reEngagementAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            } else if (slaFilter === 'debt') {
                slaIndex.debtAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            } else if (slaFilter === 'health') {
                slaIndex.healthAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            }
            dataset = dataset.filter((customer)=>relevantSystemIds.has(customer.systemId));
        }
    }
    // Apply Debt filter
    if (debtFilter !== 'all') {
        if (debtFilter === 'totalOverdue' || debtFilter === 'overdue') {
            // Filter customers with overdue debt
            dataset = dataset.filter((customer)=>{
                if (!customer.debtReminders || customer.debtReminders.length === 0) return false;
                const now = new Date();
                return customer.debtReminders.some((reminder)=>{
                    if (!reminder.dueDate) {
                        return false;
                    }
                    const dueDate = new Date(reminder.dueDate);
                    const amountDue = reminder.amountDue ?? 0;
                    return dueDate < now && amountDue > 0;
                });
            });
        } else if (debtFilter === 'dueSoon') {
            // Filter customers with debt due in 1-3 days
            dataset = dataset.filter((customer)=>{
                if (!customer.debtReminders || customer.debtReminders.length === 0) return false;
                const now = new Date();
                const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
                return customer.debtReminders.some((reminder)=>{
                    if (!reminder.dueDate) {
                        return false;
                    }
                    const dueDate = new Date(reminder.dueDate);
                    const amountDue = reminder.amountDue ?? 0;
                    return dueDate >= now && dueDate <= threeDaysLater && amountDue > 0;
                });
            });
        } else if (debtFilter === 'hasDebt') {
            // Filter customers with any debt
            dataset = dataset.filter((customer)=>(customer.currentDebt || 0) > 0);
        }
    }
    if (search.trim()) {
        const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](dataset, fuseOptions);
        dataset = fuse.search(search.trim()).map((result)=>result.item);
    }
    const sorter = sorting.id;
    dataset = [
        ...dataset
    ].sort((a, b)=>{
        const valueA = a[sorter] ?? '';
        const valueB = b[sorter] ?? '';
        if (valueA < valueB) return sorting.desc ? 1 : -1;
        if (valueA > valueB) return sorting.desc ? -1 : 1;
        return 0;
    });
    return {
        filtered: dataset
    };
}
async function fetchCustomersPage(params) {
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
    const { filtered } = applyFilters(data, params);
    const { pageIndex, pageSize } = params.pagination;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const pagedItems = filtered.slice(start, end);
    // Simulate async server latency
    await new Promise((resolve)=>setTimeout(resolve, 120));
    return {
        items: pagedItems,
        total: filtered.length,
        pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
        pageIndex
    };
}
function getFilteredCustomersSnapshot(params) {
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
    const { filtered } = applyFilters(data, params);
    return filtered;
}
}),
"[project]/features/settings/customers/sla-settings-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SLA_TYPE_DESCRIPTIONS",
    ()=>SLA_TYPE_DESCRIPTIONS,
    "SLA_TYPE_LABELS",
    ()=>SLA_TYPE_LABELS,
    "defaultCustomerSlaSettings",
    ()=>defaultCustomerSlaSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
const defaultCustomerSlaSettings = [
    // Follow-up SLA - Nhắc liên hệ định kỳ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-FOLLOWUP'),
        name: 'Liên hệ định kỳ',
        description: 'Nhắc nhở liên hệ khách hàng sau một thời gian không tương tác',
        slaType: 'follow-up',
        targetDays: 14,
        warningDays: 3,
        criticalDays: 7,
        color: '#2196F3',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    // Re-engagement SLA - Kích hoạt lại khách hàng không hoạt động
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-REENGAGEMENT'),
        name: 'Kích hoạt lại',
        description: 'Khách hàng không mua hàng cần được kích hoạt lại',
        slaType: 're-engagement',
        targetDays: 60,
        warningDays: 10,
        criticalDays: 14,
        color: '#FF9800',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    },
    // Debt Payment SLA - Nhắc thanh toán công nợ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-DEBT'),
        name: 'Nhắc công nợ',
        description: 'Nhắc thanh toán công nợ quá hạn',
        slaType: 'debt-payment',
        targetDays: 7,
        warningDays: 2,
        criticalDays: 7,
        color: '#E91E63',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-03T08:00:00Z'
        })
    }
];
const SLA_TYPE_LABELS = {
    'follow-up': 'Liên hệ định kỳ',
    're-engagement': 'Kích hoạt lại',
    'debt-payment': 'Nhắc công nợ'
};
const SLA_TYPE_DESCRIPTIONS = {
    'follow-up': 'Nhắc nhở liên hệ khách hàng theo chu kỳ định kỳ',
    're-engagement': 'Kích hoạt khách hàng không hoạt động trong thời gian dài',
    'debt-payment': 'Nhắc thanh toán công nợ quá hạn'
};
}),
"[project]/features/settings/customers/sla-settings-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSlaBySlaType",
    ()=>getSlaBySlaType,
    "loadCustomerSlaSettings",
    ()=>loadCustomerSlaSettings,
    "useCustomerSlaStore",
    ()=>useCustomerSlaStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/sla-settings-data.ts [app-ssr] (ecmascript)");
;
;
const useCustomerSlaStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultCustomerSlaSettings"], 'sla-settings', {
    persistKey: 'hrm-customer-sla-settings'
});
function getSlaBySlaType(slaType) {
    return useCustomerSlaStore.getState().data.find((sla)=>sla.slaType === slaType && sla.isActive);
}
function loadCustomerSlaSettings() {
    return useCustomerSlaStore.getState().data.filter((sla)=>sla.isActive);
}
}),
"[project]/features/orders/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const zeroDiscountLine = (productSystemId, productId, productName, quantity, unitPrice)=>({
        productSystemId,
        productId,
        productName,
        quantity,
        unitPrice,
        discount: 0,
        discountType: 'fixed'
    });
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000001'),
        customerName: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
        shippingAddress: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
        billingAddress: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-11-01 09:30',
        expectedDeliveryDate: '2025-11-05',
        expectedPaymentMethod: 'Tiền mặt',
        status: 'Hoàn thành',
        paymentStatus: 'Thanh toán toàn bộ',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-11-01 10:00',
        completedDate: '2025-11-05 15:30',
        dispatchedDate: '2025-11-02 08:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000001'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'), 'Laptop Dell Inspiron 15', 1, 15000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000002'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'), 'Chuột Logitech MX Master 3', 1, 2000000)
        ],
        subtotal: 17000000,
        shippingFee: 50000,
        tax: 0,
        orderDiscount: 500000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Khách hàng thân thiết',
        grandTotal: 16550000,
        paidAmount: 16550000,
        payments: [],
        notes: 'Giao hàng giờ hành chính',
        tags: [
            'Khách VIP',
            'Ưu tiên'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000001'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000001'),
                requestDate: '2025-11-01 08:30',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Đã giao hàng',
                carrier: 'GHN',
                service: 'Chuẩn',
                trackingCode: 'GHN000001'
            }
        ],
        shippingInfo: {
            carrier: 'GHN',
            service: 'Chuẩn',
            trackingCode: 'GHN000001'
        },
        ...buildAuditFields('2025-11-01T09:30:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000002'),
        customerName: 'Chuỗi cà phê The Coffee House',
        shippingAddress: '456 Đường XYZ, Phường 5, Quận 3, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000004'),
        branchName: 'Chi nhánh Quận 3',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
        salesperson: 'Phạm Văn D',
        orderDate: '2025-11-03 14:20',
        expectedDeliveryDate: '2025-11-08',
        expectedPaymentMethod: 'Chuyển khoản',
        status: 'Đang giao dịch',
        paymentStatus: 'Thanh toán 1 phần',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-11-03 15:00',
        dispatchedDate: '2025-11-04 09:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
        dispatchedByEmployeeName: 'Nguyễn Thị E',
        codAmount: 5000000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000003'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'), 'Điện thoại iPhone 15 Pro', 1, 28000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000004'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'), 'Ốp lưng iPhone 15 Pro', 2, 300000)
        ],
        subtotal: 28600000,
        shippingFee: 30000,
        tax: 0,
        grandTotal: 28630000,
        paidAmount: 23630000,
        payments: [],
        notes: 'Gọi trước khi giao 30 phút',
        tags: [
            'COD'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000002'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000002'),
                requestDate: '2025-11-03 16:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
                requestingEmployeeName: 'Nguyễn Thị E',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Đang giao hàng',
                carrier: 'J&T Express',
                service: 'Gói chuẩn',
                trackingCode: 'JT000245'
            }
        ],
        shippingInfo: {
            carrier: 'J&T Express',
            service: 'Gói chuẩn',
            trackingCode: 'JT000245'
        },
        ...buildAuditFields('2025-11-03T14:20:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000003'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000003'),
        customerName: 'Anh Trần Minh Hoàng',
        shippingAddress: '789 Đường MNO, Phường 10, Quận 5, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-11-05 10:15',
        expectedDeliveryDate: '2025-11-06',
        expectedPaymentMethod: 'Tiền mặt',
        status: 'Đang giao dịch',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Đã đóng gói',
        printStatus: 'Đã in',
        stockOutStatus: 'Chưa xuất kho',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Nhận tại cửa hàng',
        approvedDate: '2025-11-05 10:30',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000005'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'), 'Máy tính bảng iPad Air', 1, 18000000)
        ],
        subtotal: 18000000,
        shippingFee: 0,
        tax: 0,
        voucherCode: 'GIAM10',
        voucherAmount: 1800000,
        grandTotal: 16200000,
        paidAmount: 0,
        payments: [],
        notes: 'Khách đến lấy trong ngày',
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000003'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000003'),
                requestDate: '2025-11-05 09:30',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
                requestingEmployeeName: 'Phạm Quốc Huy',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Nhận tại cửa hàng',
                deliveryStatus: 'Chờ lấy hàng'
            }
        ],
        ...buildAuditFields('2025-11-05T10:15:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000004'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000004'),
        customerName: 'Shop thời trang GenZ Style',
        shippingAddress: '321 Đường PQR, Phường Tân Phú, Quận 7, TP.HCM',
        billingAddress: '321 Đường PQR, Phường Tân Phú, Quận 7, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000005'),
        branchName: 'Chi nhánh Quận 7',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004'),
        salesperson: 'Võ Thị F',
        orderDate: '2025-11-07 16:45',
        expectedDeliveryDate: '2025-11-12',
        expectedPaymentMethod: 'Chuyển khoản',
        status: 'Đang giao dịch',
        paymentStatus: 'Thanh toán toàn bộ',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Chưa in',
        stockOutStatus: 'Chưa xuất kho',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-11-07 17:00',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000006'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'), 'Đồng hồ Apple Watch Series 9', 1, 12000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000007'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000007'), 'Tai nghe AirPods Pro', 1, 6000000)
        ],
        subtotal: 18000000,
        shippingFee: 40000,
        tax: 0,
        orderDiscount: 1000000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Khuyến mãi 11/11',
        grandTotal: 17040000,
        paidAmount: 17040000,
        payments: [],
        notes: 'Đóng gói cẩn thận, hàng dễ vỡ',
        tags: [
            'Đã thanh toán'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000004'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000004'),
                requestDate: '2025-11-07 18:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000009'),
                requestingEmployeeName: 'Đặng Hà Vy',
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Chờ đóng gói'
            }
        ],
        ...buildAuditFields('2025-11-07T16:45:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000001'),
        customerName: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000004'),
        branchName: 'Chi nhánh Quận 3',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
        salesperson: 'Phạm Văn D',
        orderDate: '2025-11-08 11:00',
        expectedPaymentMethod: 'Tiền mặt',
        referenceUrl: 'https://shopee.vn/order/123456789',
        externalReference: 'SHOPEE-123456789',
        status: 'Đặt hàng',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Chưa in',
        stockOutStatus: 'Chưa xuất kho',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000008'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'), 'Bàn phím cơ Keychron K2', 1, 2500000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000009'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'), 'Keycap custom', 1, 800000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000010'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'), 'Switch Gateron Yellow', 90, 5000)
        ],
        subtotal: 3750000,
        shippingFee: 25000,
        tax: 0,
        grandTotal: 3775000,
        paidAmount: 0,
        payments: [],
        notes: 'Đơn từ Shopee - Kiểm tra kỹ trước khi giao',
        tags: [
            'Shopee',
            'Mới'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000005'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000005'),
                requestDate: '2025-11-08 12:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
                requestingEmployeeName: 'Nguyễn Thị E',
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Chờ đóng gói',
                noteToShipper: 'Đơn cần kiểm hàng trước khi giao'
            }
        ],
        ...buildAuditFields('2025-11-08T11:00:00Z')
    },
    // === THÊM ĐƠN HÀNG COD ĐÃ GIAO ĐỂ CÓ DỮ LIỆU ĐỐI SOÁT ===
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000005'),
        customerName: 'Chị Nguyễn Thị Hương',
        shippingAddress: '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-12-01 09:00',
        expectedDeliveryDate: '2025-12-03',
        expectedPaymentMethod: 'COD',
        status: 'Hoàn thành',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-01 09:30',
        completedDate: '2025-12-03 14:00',
        dispatchedDate: '2025-12-01 15:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 8500000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'), 'Laptop Dell Inspiron 15', 1, 15000000)
        ],
        subtotal: 15000000,
        shippingFee: 30000,
        tax: 0,
        orderDiscount: 6530000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Khuyến mãi cuối năm',
        grandTotal: 8500000,
        paidAmount: 0,
        payments: [],
        notes: 'Đơn COD - Thu hộ 8.500.000đ',
        tags: [
            'COD',
            'Chờ đối soát'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000006'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000006'),
                requestDate: '2025-12-01 10:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Đã giao hàng',
                carrier: 'GHN',
                service: 'Express',
                trackingCode: 'GHN202512010001',
                codAmount: 8500000,
                reconciliationStatus: 'Chưa đối soát'
            }
        ],
        shippingInfo: {
            carrier: 'GHN',
            service: 'Express',
            trackingCode: 'GHN202512010001'
        },
        ...buildAuditFields('2025-12-01T09:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000006'),
        customerName: 'Anh Phạm Văn Tùng',
        shippingAddress: '128 Lê Lợi, Phường 4, Quận 5, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
        salesperson: 'Phạm Văn D',
        orderDate: '2025-12-02 11:30',
        expectedDeliveryDate: '2025-12-04',
        expectedPaymentMethod: 'COD',
        status: 'Hoàn thành',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-02 12:00',
        completedDate: '2025-12-04 16:30',
        dispatchedDate: '2025-12-02 14:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
        dispatchedByEmployeeName: 'Nguyễn Thị E',
        codAmount: 3200000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'), 'Chuột Logitech MX Master 3', 1, 2000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'), 'Webcam Logitech C920', 1, 1200000)
        ],
        subtotal: 3200000,
        shippingFee: 0,
        tax: 0,
        grandTotal: 3200000,
        paidAmount: 0,
        payments: [],
        notes: 'Đơn COD - Thu hộ 3.200.000đ',
        tags: [
            'COD',
            'Chờ đối soát'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000007'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000007'),
                requestDate: '2025-12-02 12:30',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
                requestingEmployeeName: 'Nguyễn Thị E',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Đã giao hàng',
                carrier: 'J&T Express',
                service: 'Standard',
                trackingCode: 'JT202512020456',
                codAmount: 3200000,
                reconciliationStatus: 'Chưa đối soát'
            }
        ],
        shippingInfo: {
            carrier: 'J&T Express',
            service: 'Standard',
            trackingCode: 'JT202512020456'
        },
        ...buildAuditFields('2025-12-02T11:30:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000008'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000007'),
        customerName: 'Công ty TNHH Tin học ABC',
        shippingAddress: '56 Trần Hưng Đạo, Phường 6, Quận 5, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000004'),
        branchName: 'Chi nhánh Quận 3',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-12-03 08:45',
        expectedDeliveryDate: '2025-12-05',
        expectedPaymentMethod: 'COD',
        status: 'Hoàn thành',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-03 09:00',
        completedDate: '2025-12-05 10:00',
        dispatchedDate: '2025-12-03 11:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 12500000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'), 'Màn hình LG UltraWide 34"', 1, 8500000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000007'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000007'), 'SSD Samsung 1TB', 2, 2000000)
        ],
        subtotal: 12500000,
        shippingFee: 0,
        tax: 0,
        grandTotal: 12500000,
        paidAmount: 0,
        payments: [],
        notes: 'Đơn COD doanh nghiệp - Thu hộ 12.500.000đ',
        tags: [
            'COD',
            'B2B',
            'Chờ đối soát'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000008'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000008'),
                requestDate: '2025-12-03 09:30',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Đã giao hàng',
                carrier: 'GHN',
                service: 'Express',
                trackingCode: 'GHN202512030789',
                codAmount: 12500000,
                reconciliationStatus: 'Chưa đối soát'
            }
        ],
        shippingInfo: {
            carrier: 'GHN',
            service: 'Express',
            trackingCode: 'GHN202512030789'
        },
        ...buildAuditFields('2025-12-03T08:45:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000009'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000008'),
        customerName: 'Chị Lê Thị Mai',
        shippingAddress: '234 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004'),
        salesperson: 'Võ Thị F',
        orderDate: '2025-12-04 15:20',
        expectedDeliveryDate: '2025-12-06',
        expectedPaymentMethod: 'COD',
        status: 'Hoàn thành',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-04 15:30',
        completedDate: '2025-12-06 11:00',
        dispatchedDate: '2025-12-04 17:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
        dispatchedByEmployeeName: 'Nguyễn Thị E',
        codAmount: 5800000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'), 'Điện thoại iPhone 15 Pro', 1, 28000000)
        ],
        subtotal: 28000000,
        shippingFee: 50000,
        tax: 0,
        orderDiscount: 22250000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Trả góp trước - chỉ thu COD phần còn lại',
        grandTotal: 5800000,
        paidAmount: 0,
        payments: [],
        notes: 'Khách đã trả góp trước 22tr - Thu COD 5.8tr phần còn lại',
        tags: [
            'COD',
            'Trả góp'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000009'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000009'),
                requestDate: '2025-12-04 16:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
                requestingEmployeeName: 'Nguyễn Thị E',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Đã giao hàng',
                carrier: 'Viettel Post',
                service: 'Standard',
                trackingCode: 'VP202512040123',
                codAmount: 5800000,
                reconciliationStatus: 'Chưa đối soát'
            }
        ],
        shippingInfo: {
            carrier: 'Viettel Post',
            service: 'Standard',
            trackingCode: 'VP202512040123'
        },
        ...buildAuditFields('2025-12-04T15:20:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000010'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000009'),
        customerName: 'Anh Đỗ Văn Hùng',
        shippingAddress: '89 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-12-05 10:10',
        expectedDeliveryDate: '2025-12-07',
        expectedPaymentMethod: 'COD',
        status: 'Hoàn thành',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-05 10:30',
        completedDate: '2025-12-07 14:30',
        dispatchedDate: '2025-12-05 13:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 4500000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'), 'Tai nghe AirPods Pro', 1, 5000000)
        ],
        subtotal: 5000000,
        shippingFee: 0,
        tax: 0,
        orderDiscount: 500000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Giảm giá thành viên',
        grandTotal: 4500000,
        paidAmount: 0,
        payments: [],
        notes: 'Đơn COD - Thu hộ 4.500.000đ',
        tags: [
            'COD',
            'Chờ đối soát'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000010'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000010'),
                requestDate: '2025-12-05 11:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Đã giao hàng',
                carrier: 'GHN',
                service: 'Standard',
                trackingCode: 'GHN202512050456',
                codAmount: 4500000,
                reconciliationStatus: 'Chưa đối soát'
            }
        ],
        shippingInfo: {
            carrier: 'GHN',
            service: 'Standard',
            trackingCode: 'GHN202512050456'
        },
        ...buildAuditFields('2025-12-05T10:10:00Z')
    },
    // === ĐƠN HÀNG CÓ ĐÓNG GÓI ĐANG CHỜ / ĐANG ĐÓNG ===
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000011'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000010'),
        customerName: 'Chị Trần Hồng Nhung',
        shippingAddress: '456 Cách Mạng Tháng 8, Phường 11, Quận 3, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
        salesperson: 'Phạm Văn D',
        orderDate: '2025-12-08 09:00',
        expectedDeliveryDate: '2025-12-10',
        expectedPaymentMethod: 'Chuyển khoản',
        status: 'Đang giao dịch',
        paymentStatus: 'Thanh toán toàn bộ',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-08 09:30',
        dispatchedDate: '2025-12-08 10:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'), 'Bàn phím cơ Keychron K8', 2, 2000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'), 'Chuột Logitech MX Master 3', 2, 2000000)
        ],
        subtotal: 8000000,
        shippingFee: 30000,
        tax: 0,
        grandTotal: 8030000,
        paidAmount: 8030000,
        payments: [],
        notes: 'Đơn đã thanh toán - Cần đóng gói gấp',
        tags: [
            'Ưu tiên',
            'Đã thanh toán'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000011'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000011'),
                requestDate: '2025-12-08 10:30',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                status: 'Chờ đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Chờ đóng gói',
                carrier: 'GHN',
                service: 'Express'
            }
        ],
        ...buildAuditFields('2025-12-08T09:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000012'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000001'),
        customerName: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
        shippingAddress: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-12-09 14:00',
        expectedDeliveryDate: '2025-12-11',
        expectedPaymentMethod: 'Chuyển khoản',
        status: 'Đang giao dịch',
        paymentStatus: 'Thanh toán toàn bộ',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-09 14:30',
        dispatchedDate: '2025-12-09 15:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
        dispatchedByEmployeeName: 'Nguyễn Thị E',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'), 'Laptop Dell Inspiron 15', 3, 15000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'), 'Chuột Logitech MX Master 3', 3, 2000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'), 'Bàn phím cơ Keychron K8', 3, 2000000)
        ],
        subtotal: 57000000,
        shippingFee: 0,
        tax: 0,
        orderDiscount: 5000000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Đơn hàng lớn - Giảm 5 triệu',
        grandTotal: 52000000,
        paidAmount: 52000000,
        payments: [],
        notes: 'Đơn hàng doanh nghiệp - Đóng gói theo từng bộ',
        tags: [
            'B2B',
            'Khách VIP',
            'Đã thanh toán'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000012'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000012'),
                requestDate: '2025-12-09 15:30',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
                requestingEmployeeName: 'Nguyễn Thị E',
                status: 'Chờ đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Chờ đóng gói',
                carrier: 'GHN',
                service: 'Express'
            }
        ],
        ...buildAuditFields('2025-12-09T14:00:00Z')
    },
    // === THÊM ĐƠN HÀNG CHO PACKAGING PAGE ===
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000013'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000013'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000002'),
        customerName: 'Chuỗi cà phê The Coffee House',
        shippingAddress: '78 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000004'),
        branchName: 'Chi nhánh Quận 3',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004'),
        salesperson: 'Võ Thị F',
        orderDate: '2025-12-10 08:30',
        expectedDeliveryDate: '2025-12-12',
        expectedPaymentMethod: 'Chuyển khoản',
        status: 'Đang giao dịch',
        paymentStatus: 'Thanh toán toàn bộ',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-10 09:00',
        dispatchedDate: '2025-12-10 09:30',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'), 'Màn hình LG UltraWide 34"', 5, 8500000)
        ],
        subtotal: 42500000,
        shippingFee: 0,
        tax: 0,
        orderDiscount: 2500000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Đơn sỉ - Giảm 2.5 triệu',
        grandTotal: 40000000,
        paidAmount: 40000000,
        payments: [],
        notes: 'Đơn sỉ màn hình cho văn phòng - Đóng gói cẩn thận',
        tags: [
            'B2B',
            'Sỉ',
            'Đã thanh toán'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000013'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000013'),
                requestDate: '2025-12-10 10:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Chờ đóng gói',
                carrier: 'J&T Express',
                service: 'Standard',
                noteToShipper: 'Hàng dễ vỡ - Xử lý cẩn thận'
            }
        ],
        ...buildAuditFields('2025-12-10T08:30:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000014'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000014'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000003'),
        customerName: 'Anh Trần Minh Hoàng',
        shippingAddress: '789 Đường MNO, Phường 10, Quận 5, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-12-10 09:15',
        expectedDeliveryDate: '2025-12-11',
        expectedPaymentMethod: 'COD',
        status: 'Đang giao dịch',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-10 09:30',
        dispatchedDate: '2025-12-10 10:00',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
        dispatchedByEmployeeName: 'Nguyễn Thị E',
        codAmount: 6800000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'), 'Tai nghe AirPods Pro', 1, 5000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'), 'Sạc MagSafe Apple', 1, 1800000)
        ],
        subtotal: 6800000,
        shippingFee: 0,
        tax: 0,
        grandTotal: 6800000,
        paidAmount: 0,
        payments: [],
        notes: 'Đơn COD - Giao trong giờ hành chính',
        tags: [
            'COD'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000014'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000014'),
                requestDate: '2025-12-10 10:30',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000007'),
                requestingEmployeeName: 'Nguyễn Thị E',
                status: 'Chờ đóng gói',
                printStatus: 'Đã in',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Chờ đóng gói',
                carrier: 'GHN',
                service: 'Standard',
                codAmount: 6800000
            }
        ],
        ...buildAuditFields('2025-12-10T09:15:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000015'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000015'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000004'),
        customerName: 'Shop thời trang GenZ Style',
        shippingAddress: '321 Đường PQR, Phường Tân Phú, Quận 7, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000005'),
        branchName: 'Chi nhánh Quận 7',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004'),
        salesperson: 'Võ Thị F',
        orderDate: '2025-12-10 11:00',
        expectedDeliveryDate: '2025-12-12',
        expectedPaymentMethod: 'COD',
        status: 'Đang giao dịch',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Đã đóng gói',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        approvedDate: '2025-12-10 11:15',
        dispatchedDate: '2025-12-10 11:30',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 15500000,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'), 'Laptop Dell Inspiron 15', 1, 15000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'), 'Chuột Logitech MX Master 3', 1, 2000000)
        ],
        subtotal: 17000000,
        shippingFee: 50000,
        tax: 0,
        orderDiscount: 1550000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Giảm giá combo',
        grandTotal: 15500000,
        paidAmount: 0,
        payments: [],
        notes: 'Đơn COD lớn - Xác nhận số điện thoại trước khi giao',
        tags: [
            'COD',
            'Đơn lớn'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000015'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000015'),
                requestDate: '2025-12-10 12:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                assignedEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
                assignedEmployeeName: 'Phạm Quốc Huy',
                status: 'Đã đóng gói',
                printStatus: 'Đã in',
                confirmDate: '2025-12-10 13:00',
                confirmingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
                confirmingEmployeeName: 'Phạm Quốc Huy',
                deliveryMethod: 'Dịch vụ giao hàng',
                deliveryStatus: 'Chờ lấy hàng',
                carrier: 'Viettel Post',
                service: 'Express',
                trackingCode: 'VP202512100789',
                codAmount: 15500000
            }
        ],
        shippingInfo: {
            carrier: 'Viettel Post',
            service: 'Express',
            trackingCode: 'VP202512100789'
        },
        ...buildAuditFields('2025-12-10T11:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000016'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000016'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000005'),
        customerName: 'Chị Nguyễn Thị Hương',
        shippingAddress: '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        salespersonSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        salesperson: 'Trần Thị B',
        orderDate: '2025-12-10 14:00',
        expectedDeliveryDate: '2025-12-11',
        expectedPaymentMethod: 'Nhận tại cửa hàng',
        status: 'Đang giao dịch',
        paymentStatus: 'Thanh toán toàn bộ',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Đã in',
        stockOutStatus: 'Xuất kho toàn bộ',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Nhận tại cửa hàng',
        approvedDate: '2025-12-10 14:15',
        dispatchedDate: '2025-12-10 14:30',
        dispatchedByEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        dispatchedByEmployeeName: 'Lê Văn C',
        codAmount: 0,
        lineItems: [
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'), 'Điện thoại iPhone 15 Pro', 1, 28000000),
            zeroDiscountLine((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'), 'Tai nghe AirPods Pro', 1, 5000000)
        ],
        subtotal: 33000000,
        shippingFee: 0,
        tax: 0,
        orderDiscount: 3000000,
        orderDiscountType: 'fixed',
        orderDiscountReason: 'Combo điện thoại + tai nghe',
        grandTotal: 30000000,
        paidAmount: 30000000,
        payments: [],
        notes: 'Khách đến lấy tại cửa hàng - Đã thanh toán đủ',
        tags: [
            'Nhận tại CH',
            'Đã thanh toán',
            'VIP'
        ],
        packagings: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000016'),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DG000016'),
                requestDate: '2025-12-10 15:00',
                requestingEmployeeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
                requestingEmployeeName: 'Lê Văn C',
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in',
                deliveryMethod: 'Nhận tại cửa hàng',
                deliveryStatus: 'Chờ đóng gói'
            }
        ],
        ...buildAuditFields('2025-12-10T14:00:00Z')
    }
];
}),
"[project]/features/employees/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('1'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('2'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('3'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('4'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('5'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('6'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('7'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('NV000007'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('8'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('9'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('11'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('12'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
}),
"[project]/features/employees/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeRepository",
    ()=>employeeRepository,
    "useEmployeeStore",
    ()=>useEmployeeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-ssr] (ecmascript)"); // ✅ NEW
var __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repositories/in-memory-repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'employees', {
    businessIdField: 'id',
    persistKey: 'hrm-employees',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// ✅ Wrap add method to include activity history
const originalAdd = baseStore.getState().add;
const wrappedAdd = (item)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('created', `${userInfo.name} đã tạo hồ sơ nhân viên ${item.fullName} (${item.id})`, userInfo);
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
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
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
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật ${label}: "${oldDisplay || '(trống)'}" → "${newDisplay}"`, userInfo, {
                field: key,
                oldValue,
                newValue
            }));
        }
    });
    // If status changed specifically
    if (updates.employmentStatus && updates.employmentStatus !== currentEmployee.employmentStatus) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', `${userInfo.name} đã thay đổi trạng thái làm việc từ "${currentEmployee.employmentStatus}" thành "${updates.employmentStatus}"`, userInfo, {
            field: 'employmentStatus',
            oldValue: currentEmployee.employmentStatus,
            newValue: updates.employmentStatus
        }));
    }
    // If no specific changes tracked, add generic update entry
    if (historyEntries.length === 0) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật thông tin nhân viên`, userInfo));
    }
    const updatedHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(currentEmployee.activityHistory, ...historyEntries);
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
const employeeRepository = (0, __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInMemoryRepository"])(()=>baseStore.getState());
const persistence = {
    create: (payload)=>employeeRepository.create(payload),
    update: (systemId, payload)=>employeeRepository.update(systemId, payload),
    softDelete: (systemId)=>employeeRepository.softDelete(systemId),
    restore: (systemId)=>employeeRepository.restore(systemId),
    hardDelete: (systemId)=>employeeRepository.hardDelete(systemId)
};
// ✅ Register for breadcrumb auto-generation
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerBreadcrumbStore"])('employees', ()=>baseStore.getState());
// Augmented methods
const augmentedMethods = {
    // FIX: Changed `page: number = 1` to `page: number` to make it a required parameter, matching Combobox prop type.
    // ✅ CRITICAL FIX: Create fresh Fuse instance on each search to avoid stale data
    searchEmployees: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allEmployees = baseStore.getState().data;
                // ✅ Create fresh Fuse instance with current data
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allEmployees, {
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
}),
"[project]/features/products/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
        name: 'Laptop Dell Inspiron 15',
        thumbnailImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 12000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 15000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
        name: 'Chuột Logitech MX Master 3',
        thumbnailImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 1500000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 100,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 80
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-02T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'),
        name: 'Điện thoại iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 25000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 28000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 20,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 15
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-03T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'),
        name: 'Ốp lưng iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 200000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 300000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 200,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 150
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 2,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-04T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'),
        name: 'Máy tính bảng iPad Air',
        thumbnailImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 15000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 18000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 30,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 20
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'),
        name: 'Đồng hồ Apple Watch Series 9',
        thumbnailImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 10000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 12000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 40,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-06T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000007'),
        name: 'Tai nghe AirPods Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 5000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 6000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 60,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 40
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-07T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'),
        name: 'Bàn phím cơ Keychron K2',
        thumbnailImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 2000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2500000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 35,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-08T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'),
        name: 'Keycap custom',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&w=600&q=80',
        unit: 'Bộ',
        costPrice: 600000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 800000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-09T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'),
        name: 'Switch Gateron Yellow',
        thumbnailImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        unit: 'Cái',
        costPrice: 3000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 5000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 500,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 300
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 90,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-10T08:00:00Z')
    },
    // ═══════════════════════════════════════════════════════════════
    // COMBO PRODUCTS - Sản phẩm bundle
    // ═══════════════════════════════════════════════════════════════
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO001'),
        name: 'Combo Bàn phím + Keycap + Switch',
        thumbnailImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Bộ combo custom keyboard siêu hot',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 3000000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        // Combo items: Bàn phím (1) + Keycap (1) + Switch (90 cái)
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
                quantity: 90
            }
        ],
        comboPricingType: 'sum_discount_percent',
        comboDiscount: 10,
        status: 'active',
        ...buildAuditFields('2024-06-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO002'),
        name: 'Combo iPhone + Ốp lưng',
        thumbnailImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Mua iPhone kèm ốp lưng giá ưu đãi',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 27500000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                quantity: 1
            }
        ],
        comboPricingType: 'sum_discount_amount',
        comboDiscount: 800000,
        status: 'active',
        ...buildAuditFields('2024-06-15T08:00:00Z')
    }
];
}),
"[project]/features/products/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'products', {
    businessIdField: 'id',
    persistKey: 'hrm-products',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Helper to check if product tracks stock
const canModifyStock = (product)=>{
    if (!product) return false;
    // Services, digital products, and combos don't track stock directly
    if (product.type === 'service' || product.type === 'digital' || product.type === 'combo') return false;
    // Explicitly disabled stock tracking
    if (product.isStockTracked === false) return false;
    return true;
};
// Define custom methods
const updateInventory = (productSystemId, branchSystemId, quantityChange)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) return state;
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[updateInventory] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        const oldQuantity = product.inventoryByBranch?.[branchSystemId] || 0;
        const newQuantity = oldQuantity + quantityChange;
        // ✅ Removed COMPLAINT_ADJUSTMENT stock history creation
        // Stock history will be created by inventory check balance instead
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInventoryByBranch = {
                        ...p.inventoryByBranch
                    };
                    newInventoryByBranch[branchSystemId] = newQuantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventoryByBranch
                    };
                }
                return p;
            })
        };
    });
};
const commitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[commitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = (newCommitted[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const uncommitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[uncommitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const dispatchStock = (productSystemId, branchSystemId, quantity)=>{
    console.log('🔴 [dispatchStock] Called with:', {
        productSystemId,
        branchSystemId,
        quantity
    });
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) {
            console.error('❌ [dispatchStock] Product not found:', productSystemId);
            return state;
        }
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[dispatchStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        console.log('📦 [dispatchStock] Current inventory:', product.inventoryByBranch);
        console.log('📦 [dispatchStock] Current committed:', product.committedByBranch);
        return {
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    const newInventory = {
                        ...product.inventoryByBranch
                    };
                    const oldInventory = newInventory[branchSystemId] || 0;
                    newInventory[branchSystemId] = oldInventory - quantity;
                    const newCommitted = {
                        ...product.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    const newInTransit = {
                        ...product.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = (newInTransit[branchSystemId] || 0) + quantity;
                    console.log('✅ [dispatchStock] Updated inventory:', {
                        old: oldInventory,
                        new: newInventory[branchSystemId],
                        change: -quantity
                    });
                    return {
                        ...product,
                        inventoryByBranch: newInventory,
                        committedByBranch: newCommitted,
                        inTransitByBranch: newInTransit
                    };
                }
                return product;
            })
        };
    });
    console.log('✅ [dispatchStock] Completed');
};
const completeDelivery = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const returnStockFromTransit = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    const newInventory = {
                        ...p.inventoryByBranch
                    };
                    newInventory[branchSystemId] = (newInventory[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventory,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const updateLastPurchasePrice = (productSystemId, price, date)=>{
    baseStore.setState((state)=>({
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    // Only update if the new date is newer or equal to the existing lastPurchaseDate
                    const existingDate = product.lastPurchaseDate ? new Date(product.lastPurchaseDate).getTime() : 0;
                    const newDateTs = new Date(date).getTime();
                    if (newDateTs >= existingDate) {
                        return {
                            ...product,
                            lastPurchasePrice: price,
                            lastPurchaseDate: date
                        };
                    }
                }
                return product;
            })
        }));
};
const searchProducts = async (query, page = 1, limit = 10)=>{
    const allProducts = baseStore.getState().data;
    // ✅ Create fresh Fuse instance with current data (avoid stale data)
    const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allProducts, {
        keys: [
            'name',
            'id',
            'sku',
            'barcode'
        ],
        threshold: 0.3
    });
    const results = fuse.search(query);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    return {
        items: paginatedResults.map((result)=>({
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(result.item.systemId),
                label: `${result.item.name} (${result.item.id})`
            })),
        hasNextPage: endIndex < results.length
    };
};
// Wrapped add method with activity history logging
const addProduct = (product)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const newProduct = baseStore.getState().add(product);
    // Add activity history entry
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo sản phẩm ${newProduct.name} (${newProduct.id})`);
    baseStore.getState().update(newProduct.systemId, {
        ...newProduct,
        activityHistory: [
            historyEntry
        ]
    });
    return newProduct;
};
// Wrapped update method with activity history logging
const updateProduct = (systemId, updatedProduct)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const existingProduct = baseStore.getState().data.find((p)=>p.systemId === systemId);
    const historyEntries = [];
    if (existingProduct) {
        // Track status changes
        if (existingProduct.status !== updatedProduct.status) {
            const statusLabels = {
                'active': 'Đang kinh doanh',
                'inactive': 'Ngừng kinh doanh',
                'discontinued': 'Ngừng sản xuất'
            };
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, statusLabels[existingProduct.status || 'active'], statusLabels[updatedProduct.status || 'active'], `${userInfo.name} đã đổi trạng thái từ "${statusLabels[existingProduct.status || 'active']}" sang "${statusLabels[updatedProduct.status || 'active']}"`));
        }
        // Track field changes
        const fieldsToTrack = [
            {
                key: 'name',
                label: 'Tên sản phẩm'
            },
            {
                key: 'id',
                label: 'Mã SKU'
            },
            {
                key: 'description',
                label: 'Mô tả'
            },
            {
                key: 'shortDescription',
                label: 'Mô tả ngắn'
            },
            {
                key: 'type',
                label: 'Loại sản phẩm'
            },
            {
                key: 'categorySystemId',
                label: 'Danh mục'
            },
            {
                key: 'brandSystemId',
                label: 'Thương hiệu'
            },
            {
                key: 'unit',
                label: 'Đơn vị tính'
            },
            {
                key: 'costPrice',
                label: 'Giá vốn'
            },
            {
                key: 'minPrice',
                label: 'Giá tối thiểu'
            },
            {
                key: 'barcode',
                label: 'Mã vạch'
            },
            {
                key: 'primarySupplierSystemId',
                label: 'Nhà cung cấp chính'
            },
            {
                key: 'warrantyPeriodMonths',
                label: 'Thời hạn bảo hành'
            },
            {
                key: 'reorderLevel',
                label: 'Mức đặt hàng lại'
            },
            {
                key: 'safetyStock',
                label: 'Tồn kho an toàn'
            },
            {
                key: 'maxStock',
                label: 'Tồn kho tối đa'
            }
        ];
        const changes = [];
        for (const field of fieldsToTrack){
            const oldVal = existingProduct[field.key];
            const newVal = updatedProduct[field.key];
            if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                if (field.key === 'status') continue;
                const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
            }
        }
        // Track price changes separately
        if (existingProduct.costPrice !== updatedProduct.costPrice) {
            changes.push(`Giá vốn: ${existingProduct.costPrice?.toLocaleString('vi-VN')} → ${updatedProduct.costPrice?.toLocaleString('vi-VN')}`);
        }
        if (changes.length > 0) {
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
        }
    }
    const productWithHistory = {
        ...updatedProduct,
        activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingProduct?.activityHistory, ...historyEntries)
    };
    baseStore.getState().update(systemId, productWithHistory);
};
const useProductStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
// Export getState method for non-hook usage
useProductStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
useProductStore.subscribe = baseStore.subscribe;
}),
"[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Combo Product Utilities
 * ═══════════════════════════════════════════════════════════════
 * Tham khảo: Sapo Combo
 * - Combo không có tồn kho riêng
 * - Tồn kho combo = MIN(tồn kho SP con / số lượng trong combo)
 * - Tối đa 20 sản phẩm con
 * - Không cho phép combo lồng combo
 * ═══════════════════════════════════════════════════════════════
 */ __turbopack_context__.s([
    "MAX_COMBO_ITEMS",
    ()=>MAX_COMBO_ITEMS,
    "MIN_COMBO_ITEMS",
    ()=>MIN_COMBO_ITEMS,
    "calculateComboCostPrice",
    ()=>calculateComboCostPrice,
    "calculateComboLastPurchasePrice",
    ()=>calculateComboLastPurchasePrice,
    "calculateComboMinPrice",
    ()=>calculateComboMinPrice,
    "calculateComboPrice",
    ()=>calculateComboPrice,
    "calculateComboPricesByPolicy",
    ()=>calculateComboPricesByPolicy,
    "calculateComboStock",
    ()=>calculateComboStock,
    "calculateComboStockAllBranches",
    ()=>calculateComboStockAllBranches,
    "calculateFinalComboPricesByPolicy",
    ()=>calculateFinalComboPricesByPolicy,
    "canAddToCombo",
    ()=>canAddToCombo,
    "getComboBottleneckProducts",
    ()=>getComboBottleneckProducts,
    "getComboSummary",
    ()=>getComboSummary,
    "hasComboStock",
    ()=>hasComboStock,
    "isComboProduct",
    ()=>isComboProduct,
    "validateComboItems",
    ()=>validateComboItems
]);
const MAX_COMBO_ITEMS = 20;
const MIN_COMBO_ITEMS = 2;
function isComboProduct(product) {
    return product.type === 'combo';
}
function canAddToCombo(product) {
    if (product.type === 'combo') return false;
    if (product.status === 'discontinued') return false;
    if (product.isDeleted) return false;
    return true;
}
function validateComboItems(comboItems, allProducts) {
    // Check minimum items
    if (comboItems.length < MIN_COMBO_ITEMS) {
        return `Combo phải có ít nhất ${MIN_COMBO_ITEMS} sản phẩm`;
    }
    // Check maximum items
    if (comboItems.length > MAX_COMBO_ITEMS) {
        return `Combo chỉ được tối đa ${MAX_COMBO_ITEMS} sản phẩm`;
    }
    // Check for duplicate products
    const productIds = comboItems.map((item)=>item.productSystemId);
    const uniqueIds = new Set(productIds);
    if (uniqueIds.size !== productIds.length) {
        return 'Combo không được chứa sản phẩm trùng lặp';
    }
    // Check each item
    for (const item of comboItems){
        // Check quantity
        if (item.quantity < 1) {
            return 'Số lượng sản phẩm trong combo phải >= 1';
        }
        if (!Number.isInteger(item.quantity)) {
            return 'Số lượng sản phẩm trong combo phải là số nguyên';
        }
        // Check product exists and is valid
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) {
            return 'Sản phẩm trong combo không tồn tại';
        }
        if (!canAddToCombo(product)) {
            return `Sản phẩm "${product.name}" không thể thêm vào combo`;
        }
    }
    return null;
}
function calculateComboStock(comboItems, allProducts, branchSystemId) {
    if (!comboItems || comboItems.length === 0) return 0;
    let minComboQuantity = Infinity;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) return 0; // If any product not found, combo unavailable
        // Available = On-hand - Committed
        const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
        const committed = product.committedByBranch?.[branchSystemId] || 0;
        const available = onHand - committed;
        // How many combos can we make from this product?
        const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
        minComboQuantity = Math.min(minComboQuantity, comboQuantityFromThisProduct);
    }
    return minComboQuantity === Infinity ? 0 : Math.max(0, minComboQuantity);
}
function calculateComboStockAllBranches(comboItems, allProducts) {
    if (!comboItems || comboItems.length === 0) return {};
    // Collect all branch IDs from child products
    const allBranchIds = new Set();
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (product?.inventoryByBranch) {
            Object.keys(product.inventoryByBranch).forEach((branchId)=>{
                allBranchIds.add(branchId);
            });
        }
    }
    // Calculate stock for each branch
    const result = {};
    for (const branchId of allBranchIds){
        result[branchId] = calculateComboStock(comboItems, allProducts, branchId);
    }
    return result;
}
function calculateComboPrice(comboItems, allProducts, pricingPolicySystemId, comboPricingType, comboDiscount = 0) {
    if (comboPricingType === 'fixed') {
        // Fixed price is stored directly, not calculated
        return comboDiscount; // In fixed mode, comboDiscount IS the price
    }
    // Calculate sum of child products' prices
    let sumPrice = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        const unitPrice = product.prices?.[pricingPolicySystemId] || 0;
        sumPrice += unitPrice * item.quantity;
    }
    // Apply discount
    if (comboPricingType === 'sum_discount_percent') {
        const discountAmount = sumPrice * (comboDiscount / 100);
        return Math.round(sumPrice - discountAmount);
    }
    if (comboPricingType === 'sum_discount_amount') {
        return Math.max(0, sumPrice - comboDiscount);
    }
    return sumPrice;
}
const isNumber = (value)=>typeof value === 'number' && Number.isFinite(value);
function calculateComboCostPrice(comboItems, allProducts, options = {}) {
    const { fallbackPricingPolicyId, allowPriceFallback = true } = options;
    let totalCost = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        let unitCost = product.costPrice;
        if (!isNumber(unitCost) && isNumber(product.lastPurchasePrice)) {
            unitCost = product.lastPurchasePrice;
        }
        if (!isNumber(unitCost) && allowPriceFallback) {
            if (fallbackPricingPolicyId && isNumber(product.prices?.[fallbackPricingPolicyId])) {
                unitCost = product.prices[fallbackPricingPolicyId];
            }
            if (!isNumber(unitCost)) {
                const firstPrice = Object.values(product.prices || {}).find((price)=>isNumber(price));
                if (isNumber(firstPrice)) {
                    unitCost = firstPrice;
                }
            }
        }
        if (!isNumber(unitCost) && isNumber(product.minPrice)) {
            unitCost = product.minPrice;
        }
        totalCost += (unitCost || 0) * item.quantity;
    }
    return totalCost;
}
function calculateComboLastPurchasePrice(comboItems, allProducts) {
    let total = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        total += (product.lastPurchasePrice || 0) * item.quantity;
    }
    return total;
}
function calculateComboMinPrice(comboItems, allProducts) {
    let total = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        total += (product.minPrice || 0) * item.quantity;
    }
    return total;
}
function calculateComboPricesByPolicy(comboItems, allProducts) {
    const pricesByPolicy = {};
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product || !product.prices) continue;
        for (const [policyId, price] of Object.entries(product.prices)){
            if (!pricesByPolicy[policyId]) {
                pricesByPolicy[policyId] = 0;
            }
            pricesByPolicy[policyId] += (price || 0) * item.quantity;
        }
    }
    return pricesByPolicy;
}
function calculateFinalComboPricesByPolicy(comboItems, allProducts, comboPricingType, comboDiscount = 0, _defaultPolicyId) {
    // Get raw sum prices first
    const rawPricesByPolicy = calculateComboPricesByPolicy(comboItems, allProducts);
    const finalPricesByPolicy = {};
    if (comboPricingType === 'fixed') {
        // For fixed pricing, only policies that exist on child products should be auto-filled.
        for (const policyId of Object.keys(rawPricesByPolicy)){
            finalPricesByPolicy[policyId] = comboDiscount; // comboDiscount IS the price in fixed mode
        }
        return finalPricesByPolicy;
    }
    // For discount-based pricing, apply discount to each policy's sum
    for (const [policyId, sumPrice] of Object.entries(rawPricesByPolicy)){
        if (comboPricingType === 'sum_discount_percent') {
            const discountAmount = sumPrice * (comboDiscount / 100);
            finalPricesByPolicy[policyId] = Math.round(sumPrice - discountAmount);
        } else if (comboPricingType === 'sum_discount_amount') {
            finalPricesByPolicy[policyId] = Math.max(0, sumPrice - comboDiscount);
        } else {
            // No discount, use raw sum
            finalPricesByPolicy[policyId] = sumPrice;
        }
    }
    return finalPricesByPolicy;
}
function getComboSummary(comboItems, allProducts, branchSystemId) {
    const itemCount = comboItems?.length || 0;
    if (!branchSystemId) {
        return `${itemCount} sản phẩm`;
    }
    const stock = calculateComboStock(comboItems, allProducts, branchSystemId);
    return `${itemCount} sản phẩm, tồn kho: ${stock}`;
}
function hasComboStock(comboItems, allProducts, branchSystemId, requiredQuantity) {
    const available = calculateComboStock(comboItems, allProducts, branchSystemId);
    return available >= requiredQuantity;
}
function getComboBottleneckProducts(comboItems, allProducts, branchSystemId) {
    if (!comboItems || comboItems.length === 0) return [];
    const comboStock = calculateComboStock(comboItems, allProducts, branchSystemId);
    const bottlenecks = [];
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
        const committed = product.committedByBranch?.[branchSystemId] || 0;
        const available = onHand - committed;
        const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
        // This product is a bottleneck if it limits the combo quantity
        if (comboQuantityFromThisProduct === comboStock) {
            bottlenecks.push({
                product,
                availableForCombo: comboQuantityFromThisProduct,
                itemQuantity: item.quantity
            });
        }
    }
    return bottlenecks;
}
}),
"[project]/features/stock-history/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const rawData = [
    // PROD000001 - Laptop Dell Inspiron 15 (Khởi tạo: CN000001=50, CN000002=30)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000001'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000001'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 50,
        newStockLevel: 50,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000002'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000001'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000003'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000001'),
        date: '2025-11-01T09:30:00Z',
        employeeName: 'Trần Thị B',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 49,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000002 - Chuột Logitech MX Master 3 (Khởi tạo: CN000001=100, CN000002=80)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000004'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000002'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 100,
        newStockLevel: 100,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000005'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000002'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 80,
        newStockLevel: 80,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000006'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000002'),
        date: '2025-11-01T09:30:00Z',
        employeeName: 'Trần Thị B',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 99,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000003 - Điện thoại iPhone 15 Pro (Khởi tạo: CN000001=20, CN000002=15)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000007'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000003'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000003'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000008'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000003'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 15,
        newStockLevel: 15,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000003'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000009'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000003'),
        date: '2025-11-03T14:20:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 19,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000004 - Ốp lưng iPhone 15 Pro (Khởi tạo: CN000001=200, CN000002=150)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000010'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000004'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 200,
        newStockLevel: 200,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000011'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000004'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 150,
        newStockLevel: 150,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000012'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000004'),
        date: '2025-11-03T14:20:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -2,
        newStockLevel: 198,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000005 - Máy tính bảng iPad Air (Khởi tạo: CN000001=30, CN000002=20)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000013'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000005'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000014'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000005'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000015'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000005'),
        date: '2025-11-05T10:15:00Z',
        employeeName: 'Trần Thị B',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 29,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000003'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000006 - Đồng hồ Apple Watch Series 9 (Khởi tạo: CN000001=40, CN000002=25)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000016'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000006'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 40,
        newStockLevel: 40,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000017'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000006'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 25,
        newStockLevel: 25,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000018'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000006'),
        date: '2025-11-07T16:45:00Z',
        employeeName: 'Võ Thị F',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 39,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000007 - Tai nghe AirPods Pro (Khởi tạo: CN000001=60, CN000002=40)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000019'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000007'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 60,
        newStockLevel: 60,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000020'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000007'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 40,
        newStockLevel: 40,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000021'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000007'),
        date: '2025-11-07T16:45:00Z',
        employeeName: 'Võ Thị F',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 59,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000008 - Bàn phím cơ Keychron K2 (Khởi tạo: CN000001=35, CN000002=25)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000022'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000008'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 35,
        newStockLevel: 35,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000008'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000023'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000008'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 25,
        newStockLevel: 25,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000008'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000024'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000008'),
        date: '2025-11-08T11:00:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 34,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000009 - Keycap custom (Khởi tạo: CN000001=50, CN000002=30)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000025'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000009'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 50,
        newStockLevel: 50,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000009'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000026'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000009'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000009'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000027'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000009'),
        date: '2025-11-08T11:00:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 49,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000010 - Switch Gateron Yellow (Khởi tạo: CN000001=500, CN000002=300)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000028'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000010'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 500,
        newStockLevel: 500,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000010'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000029'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000010'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 300,
        newStockLevel: 300,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000010'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000030'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000010'),
        date: '2025-11-10T09:45:00Z',
        employeeName: 'Vũ Quốc H',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -2,
        newStockLevel: 498,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000011 - Laptop HP Spectre (Khởi tạo: CN000001=25, CN000002=15)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000031'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000011'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 25,
        newStockLevel: 25,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000011'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000032'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000011'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 15,
        newStockLevel: 15,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000011'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000033'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000011'),
        date: '2025-11-10T09:45:00Z',
        employeeName: 'Vũ Quốc H',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 24,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000012 - Màn hình LG UltraFine (Khởi tạo: CN000001=40, CN000002=20)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000034'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000012'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 40,
        newStockLevel: 40,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000012'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000035'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000012'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000012'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000036'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000012'),
        date: '2025-11-12T13:00:00Z',
        employeeName: 'Nguyễn Văn I',
        action: 'Nhập hàng từ NCC',
        quantityChange: 10,
        newStockLevel: 50,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PNK000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000013 - Máy in Canon LBP2900 (Khởi tạo: CN000001=30, CN000002=20)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000037'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000013'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000013'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000038'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000013'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000013'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000039'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000013'),
        date: '2025-11-12T13:00:00Z',
        employeeName: 'Nguyễn Văn I',
        action: 'Nhập hàng từ NCC',
        quantityChange: 5,
        newStockLevel: 35,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PNK000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000014 - Balo laptop Targus (Khởi tạo: CN000001=80, CN000002=60)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000040'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000014'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 80,
        newStockLevel: 80,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000014'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000041'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000014'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 60,
        newStockLevel: 60,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000014'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000042'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000014'),
        date: '2025-11-13T15:20:00Z',
        employeeName: 'Lê Thị J',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -3,
        newStockLevel: 77,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000015 - Ổ cứng SSD Samsung 980 Pro (Khởi tạo: CN000001=120, CN000002=80)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000043'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000015'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 120,
        newStockLevel: 120,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000015'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000044'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000015'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 80,
        newStockLevel: 80,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000015'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000045'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000015'),
        date: '2025-11-13T15:20:00Z',
        employeeName: 'Lê Thị J',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -2,
        newStockLevel: 118,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    }
];
const data = rawData.map((entry)=>({
        ...entry,
        ...buildAuditFields(entry.date)
    }));
}),
"[project]/features/stock-history/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStockHistoryStore",
    ()=>useStockHistoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/data.ts [app-ssr] (ecmascript)");
;
;
;
// ✨ Migration helper: Convert SKU to systemId for old data
function migrateHistoryData(entries) {
    // Map SKU → systemId from products
    const skuToSystemId = {
        'DV-WEB-01': 'SP00000001',
        'DV-WEB-02': 'SP00000002',
        'DV-WEB-03': 'SP00000003',
        'DV-MKT-01': 'SP00000004',
        'DV-MKT-02': 'SP00000005',
        'DV-MKT-03': 'SP00000006',
        'DV-SEO-01': 'SP00000007',
        'DV-SEO-02': 'SP00000008',
        'DV-IT-01': 'SP00000009',
        'DV-DSN-01': 'SP00000010',
        'SW-CRM-01': 'SP00000011',
        'SW-ERP-01': 'SP00000012',
        'SW-WIN-01': 'SP00000013',
        'SW-OFF-01': 'SP00000014',
        'SW-ADOBE-01': 'SP00000015',
        'HW-SRV-01': 'SP00000016',
        'HW-SRV-02': 'SP00000017',
        'HW-PC-01': 'SP00000018',
        'HW-PC-02': 'SP00000019',
        'HW-LT-01': 'SP00000020',
        'HW-NET-01': 'SP00000021',
        'HW-NET-02': 'SP00000022',
        'HW-CAM-01': 'SP00000023',
        'MISC-HOST-01': 'SP00000024',
        'MISC-HOST-02': 'SP00000025',
        'MISC-SSL-01': 'SP00000026',
        'MISC-DOMAIN-COM': 'SP00000027',
        'MISC-DOMAIN-VN': 'SP00000028',
        'MISC-PRINT-01': 'SP00000029',
        'MISC-PRINT-02': 'SP00000030'
    };
    return entries.map((entry)=>({
            ...entry,
            productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(skuToSystemId[entry.productId] || entry.productId) // Convert or keep if already systemId
        }));
}
let entryCounter = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"].length;
const useStockHistoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        entries: migrateHistoryData(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"]),
        addEntry: (entry)=>set((state)=>{
                entryCounter++;
                const newEntry = {
                    ...entry,
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`HISTORY${String(Date.now()).slice(-6)}_${entryCounter}`)
                };
                return {
                    entries: [
                        ...state.entries,
                        newEntry
                    ]
                };
            }),
        getHistoryForProduct: (productId, branchSystemId = 'all')=>{
            const productHistory = get().entries.filter((e)=>e.productId === productId);
            const sortedHistory = productHistory.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
            if (branchSystemId === 'all') {
                return sortedHistory;
            }
            return sortedHistory.filter((e)=>e.branchSystemId === branchSystemId);
        }
    }));
}),
"[project]/features/settings/receipt-types/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('THANHTOAN'),
        name: 'Thanh toán cho đơn hàng',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#10b981',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DATCOC'),
        name: 'Đối tác vận chuyển đặt cọc',
        description: '',
        isBusinessResult: false,
        isActive: true,
        color: '#3b82f6',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('THUNO'),
        name: 'Thu nợ đối tác vận chuyển',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#8b5cf6',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('RVGN7'),
        name: 'Thu nhập khác',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#06b6d4',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('RVGN6'),
        name: 'Tiền thưởng',
        description: '',
        isBusinessResult: false,
        isActive: true,
        color: '#f59e0b',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('RVGN5'),
        name: 'Tiền bồi thường',
        description: '',
        isBusinessResult: false,
        isActive: true,
        color: '#ef4444',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('RVGN4'),
        name: 'Cho thuê tài sản',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#14b8a6',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('RVGN3'),
        name: 'Nhượng bán, thanh lý tài sản',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#a855f7',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('RVGN2'),
        name: 'Thu nợ khách hàng',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#ec4899',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TUDONG'),
        name: 'Tự động',
        description: '',
        isBusinessResult: false,
        isActive: true,
        color: '#6b7280',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('NCCHT'),
        name: 'Nhà cung cấp hoàn tiền',
        description: 'Ghi nhận khoản tiền NCC hoàn lại do hủy đơn, trả hàng...',
        isBusinessResult: false,
        isActive: true,
        color: '#0ea5e9',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DOISOATCOD'),
        name: 'Đối soát COD',
        description: 'Ghi nhận tiền thu hộ COD từ đối tác vận chuyển.',
        isBusinessResult: true,
        isActive: true,
        color: '#22c55e',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-12-31'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000013'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('THUBH'),
        name: 'Thu tiền bảo hành',
        description: 'Thu thêm tiền từ khách hàng do chi phí bảo hành (không trừ vào đơn hàng)',
        isBusinessResult: false,
        isActive: true,
        color: '#f97316',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2025-11-09'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000014'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('THUVAO_DONHANG'),
        name: 'Thu bảo hành vào đơn hàng',
        description: 'Thu tiền bảo hành và trừ vào đơn hàng của khách',
        isBusinessResult: false,
        isActive: true,
        color: '#06b6d4',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2025-11-09'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT000015'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('CHIPHI_PHATSINH'),
        name: 'Chi phí phát sinh',
        description: 'Thu chi phí phát sinh từ nhân viên do lỗi xử lý khiếu nại',
        isBusinessResult: false,
        isActive: true,
        color: '#dc2626',
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2025-11-10'
        })
    }
];
}),
"[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptTypeStore",
    ()=>useReceiptTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'receipt-types', {
    businessIdField: 'id',
    persistKey: 'hrm-receipt-types'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const useReceiptTypeStore = baseStore;
}),
"[project]/features/cashbook/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TK000001'),
        name: 'Quỹ tiền mặt',
        initialBalance: 1727238671,
        type: 'cash',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        isActive: true,
        isDefault: true,
        minBalance: 1000000,
        maxBalance: 5000000000,
        ...buildAuditFields('2024-01-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TK000002'),
        name: 'Tài khoản Vietcombank',
        initialBalance: 500000000,
        type: 'bank',
        bankAccountNumber: '0123456789',
        bankBranch: 'PGD Bến Thành',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        isActive: true,
        isDefault: true,
        bankName: 'Vietcombank',
        bankCode: 'VCB',
        accountHolder: 'CÔNG TY TNHH ABC',
        minBalance: 5000000,
        ...buildAuditFields('2024-01-02T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TK000003'),
        name: 'Tài khoản ACB',
        initialBalance: 250000000,
        type: 'bank',
        bankAccountNumber: '9876543210',
        bankBranch: 'Chi nhánh Sài Gòn',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002'),
        isActive: true,
        isDefault: false,
        bankName: 'ACB',
        bankCode: 'ACB',
        accountHolder: 'CÔNG TY TNHH ABC',
        ...buildAuditFields('2024-01-03T08:00:00Z')
    }
];
}),
"[project]/features/cashbook/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCashbookStore",
    ()=>useCashbookStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
const CASH_ACCOUNT_ENTITY = 'cash-accounts';
const SYSTEM_ID_PREFIX = 'ACCOUNT';
const BUSINESS_ID_PREFIX = 'TK';
const BUSINESS_ID_DIGITS = 6;
const getNextSystemId = (accounts)=>{
    const currentCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(accounts, SYSTEM_ID_PREFIX);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(CASH_ACCOUNT_ENTITY, currentCounter + 1));
};
const ensureBusinessId = (accounts, provided)=>{
    if (provided && provided.trim()) {
        return provided;
    }
    const existingIds = accounts.map((acc)=>acc.id);
    const startCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(accounts, BUSINESS_ID_PREFIX);
    const { nextId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, startCounter, BUSINESS_ID_DIGITS);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useCashbookStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        accounts: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"],
        getAccountById: (id)=>get().accounts.find((a)=>a.id === id),
        add: (item)=>set((state)=>{
                const newAccount = {
                    ...item,
                    systemId: getNextSystemId(state.accounts),
                    id: ensureBusinessId(state.accounts, item.id)
                };
                return {
                    accounts: [
                        ...state.accounts,
                        newAccount
                    ]
                };
            }),
        update: (systemId, updatedItem)=>set((state)=>({
                    accounts: state.accounts.map((acc)=>acc.systemId === systemId ? updatedItem : acc)
                })),
        remove: (systemId)=>set((state)=>({
                    accounts: state.accounts.filter((acc)=>acc.systemId !== systemId)
                })),
        setDefault: (systemId)=>set((state)=>{
                const targetAccount = state.accounts.find((acc)=>acc.systemId === systemId);
                if (!targetAccount) return state;
                return {
                    accounts: state.accounts.map((acc)=>({
                            ...acc,
                            isDefault: (acc.type === targetAccount.type ? acc.systemId === systemId : acc.isDefault) ?? false
                        }))
                };
            })
    }));
}),
"[project]/features/receipts/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RECEIPT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PT000001'),
        date: '2024-11-10',
        amount: 5_000_000,
        payerTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
        payerTypeName: 'Khách hàng',
        payerName: 'Nguyễn Văn A',
        payerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000001'),
        description: 'Thu tiền bán hàng',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('TIENMAT'),
        paymentMethodName: 'Tiền mặt',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC_CASH'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT_SALE'),
        paymentReceiptTypeName: 'Bán hàng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-10T10:00:00Z',
        status: 'completed',
        category: 'sale',
        affectsDebt: false,
        runningBalance: 1_732_238_671,
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000001'),
        customerName: 'Nguyễn Văn A'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RECEIPT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PT000002'),
        date: '2024-11-11',
        amount: 3_000_000,
        payerTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
        payerTypeName: 'Khách hàng',
        payerName: 'Trần Thị B',
        payerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000002'),
        description: 'Thu tiền khách hàng thanh toán công nợ',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CHUYENKHOAN'),
        paymentMethodName: 'Chuyển khoản',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC_VCB'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT_PAYMENT'),
        paymentReceiptTypeName: 'Thu công nợ',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-11T14:30:00Z',
        status: 'completed',
        category: 'customer_payment',
        affectsDebt: true,
        runningBalance: 503_000_000,
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000002'),
        customerName: 'Trần Thị B'
    }
];
}),
"[project]/features/settings/target-groups/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHOM000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('KHACHHANG'),
        name: 'Khách hàng',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-05T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHOM000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('NHACUNGCAP'),
        name: 'Nhà cung cấp',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-06T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHOM000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('NHANVIEN'),
        name: 'Nhân viên',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-07T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHOM000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DOITACVC'),
        name: 'Đối tác vận chuyển',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-08T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHOM000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('KHAC'),
        name: 'Khác',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-09T08:00:00Z'
        })
    }
];
}),
"[project]/features/settings/target-groups/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTargetGroupStore",
    ()=>useTargetGroupStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/target-groups/data.ts [app-ssr] (ecmascript)");
;
;
const useTargetGroupStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'target-groups', {
    persistKey: 'hrm-target-groups' // ✅ Enable localStorage persistence
});
}),
"[project]/features/settings/payments/methods/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PM000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TIEN_MAT'),
        name: 'Tiền mặt',
        isDefault: true,
        isActive: true,
        color: '#10b981',
        icon: 'Wallet',
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PM000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('CHUYEN_KHOAN'),
        name: 'Chuyển khoản',
        isDefault: false,
        isActive: true,
        color: '#3b82f6',
        icon: 'ArrowRightLeft',
        ...buildAuditFields('2024-01-06T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PM000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('QUET_THE'),
        name: 'Quẹt thẻ',
        isDefault: false,
        isActive: true,
        color: '#8b5cf6',
        icon: 'CreditCard',
        ...buildAuditFields('2024-01-07T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PM000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('COD'),
        name: 'COD',
        isDefault: false,
        isActive: true,
        color: '#f59e0b',
        icon: 'Package',
        ...buildAuditFields('2024-01-08T08:00:00Z')
    }
];
}),
"[project]/features/settings/payments/methods/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentMethodStore",
    ()=>usePaymentMethodStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/methods/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
const usePaymentMethodStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set)=>({
        data: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"],
        add: (item)=>set((state)=>{
                const newItem = {
                    ...item,
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`PM_${Date.now()}`),
                    isDefault: state.data.length === 0
                };
                return {
                    data: [
                        ...state.data,
                        newItem
                    ]
                };
            }),
        update: (systemId, updatedFields)=>set((state)=>({
                    data: state.data.map((p)=>p.systemId === systemId ? {
                            ...p,
                            ...updatedFields
                        } : p)
                })),
        remove: (systemId)=>set((state)=>({
                    data: state.data.filter((p)=>p.systemId !== systemId)
                })),
        setDefault: (systemId)=>set((state)=>({
                    data: state.data.map((p)=>({
                            ...p,
                            isDefault: p.systemId === systemId
                        }))
                }))
    }));
}),
"[project]/features/settings/payments/types/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN18'),
        name: 'Chi phí vận chuyển',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#0ea5e9',
        ...buildAuditFields('2025-09-16')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN17'),
        name: 'Chi phí văn phòng phẩm',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#8b5cf6',
        ...buildAuditFields('2025-09-16')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('HOANTIEN'),
        name: 'Hoàn tiền khách hàng',
        description: 'Ghi nhận các khoản hoàn tiền cho khách hàng do hủy đơn, trả hàng...',
        isBusinessResult: false,
        isActive: true,
        color: '#ef4444',
        ...buildAuditFields('2025-09-16')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('THANHTOANDONNHAP'),
        name: 'Thanh toán cho đơn nhập hàng',
        description: '',
        isBusinessResult: false,
        isActive: true,
        color: '#10b981',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000014'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('HOANTIEN_BH'),
        name: 'Hoàn tiền bảo hành',
        description: 'Hoàn tiền cho khách hàng do bảo hành sản phẩm (không trừ vào đơn hàng)',
        isBusinessResult: false,
        isActive: true,
        color: '#f97316',
        ...buildAuditFields('2025-11-09')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000015'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TRAVAO_DONHANG'),
        name: 'Trả bảo hành vào đơn hàng',
        description: 'Khách nhận sản phẩm bảo hành và đặt đơn mới, trừ tiền vào đơn hàng',
        isBusinessResult: false,
        isActive: true,
        color: '#06b6d4',
        ...buildAuditFields('2025-11-09')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TRANO'),
        name: 'Trả nợ đối tác vận chuyển',
        description: '',
        isBusinessResult: false,
        isActive: true,
        color: '#f59e0b',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN15'),
        name: 'Chi phí khác',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#6b7280',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN14'),
        name: 'Chi phí sản xuất',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#14b8a6',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN13'),
        name: 'Chi phí nguyên - vật liệu',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#22c55e',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN12'),
        name: 'Chi phí sinh hoạt',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#ec4899',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN11'),
        name: 'Chi phí nhân công',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#3b82f6',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN10'),
        name: 'Chi phí bán hàng',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#a855f7',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PVGN9'),
        name: 'Chi phí quản lý cửa hàng',
        description: '',
        isBusinessResult: true,
        isActive: true,
        color: '#06b6d4',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000013'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TUDONG'),
        name: 'Tự động',
        description: '',
        isBusinessResult: false,
        isActive: true,
        color: '#6b7280',
        ...buildAuditFields('2024-12-31')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT000016'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('BUTRU_KHIEUNAI'),
        name: 'Bù trừ khiếu nại',
        description: 'Chi phí bù trừ cho khách hàng do khiếu nại đơn hàng',
        isBusinessResult: false,
        isActive: true,
        color: '#dc2626',
        ...buildAuditFields('2025-11-10')
    }
];
}),
"[project]/features/settings/payments/types/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentTypeStore",
    ()=>usePaymentTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/types/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'payment-types', {
    businessIdField: 'id',
    persistKey: 'hrm-payment-types'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const usePaymentTypeStore = baseStore;
}),
"[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_CUSTOMER_GROUP",
    ()=>DEFAULT_CUSTOMER_GROUP,
    "pickAccount",
    ()=>pickAccount,
    "pickPaymentMethod",
    ()=>pickPaymentMethod,
    "pickPaymentType",
    ()=>pickPaymentType,
    "pickReceiptType",
    ()=>pickReceiptType,
    "pickTargetGroup",
    ()=>pickTargetGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/target-groups/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/methods/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/types/store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const normalizeName = (value)=>(value ?? '').trim().toLowerCase();
const DEFAULT_CUSTOMER_GROUP = 'khách hàng';
const pickTargetGroup = (options)=>{
    const groups = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTargetGroupStore"].getState().data ?? [];
    if (groups.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = groups.find((group)=>group.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    const lookupNames = [
        options?.name,
        options?.fallbackName,
        DEFAULT_CUSTOMER_GROUP
    ].filter(Boolean);
    for (const candidate of lookupNames){
        const normalized = normalizeName(candidate);
        const match = groups.find((group)=>normalizeName(group.name) === normalized);
        if (match) {
            return match;
        }
    }
    return groups[0] ?? null;
};
const pickPaymentMethod = (options)=>{
    const methods = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentMethodStore"].getState().data ?? [];
    if (methods.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = methods.find((method)=>method.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = methods.find((method)=>normalizeName(method.name) === normalized);
        if (match) {
            return match;
        }
    }
    return methods.find((method)=>method.isDefault) ?? methods[0] ?? null;
};
const pickAccount = (options)=>{
    const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
    if (!accounts || accounts.length === 0) {
        return null;
    }
    if (options.accountSystemId) {
        const match = accounts.find((account)=>account.systemId === options.accountSystemId);
        if (match) {
            return match;
        }
    }
    let preferredType = options.preferredType;
    if (!preferredType && options.paymentMethodName) {
        const normalizedMethod = normalizeName(options.paymentMethodName);
        preferredType = normalizedMethod === 'tiền mặt' ? 'cash' : normalizedMethod === 'chuyển khoản' ? 'bank' : undefined;
    }
    const candidates = preferredType ? accounts.filter((account)=>account.type === preferredType) : accounts;
    if (candidates.length === 0) {
        return accounts[0];
    }
    return candidates.find((account)=>account.branchSystemId && options.branchSystemId && account.branchSystemId === options.branchSystemId) ?? candidates.find((account)=>account.isDefault) ?? candidates[0];
};
const pickReceiptType = (options)=>{
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState().data ?? [];
    if (types.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = types.find((type)=>type.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = types.find((type)=>normalizeName(type.name) === normalized);
        if (match) {
            return match;
        }
    }
    return types[0] ?? null;
};
const pickPaymentType = (options)=>{
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentTypeStore"].getState().data ?? [];
    if (types.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = types.find((type)=>type.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = types.find((type)=>normalizeName(type.name) === normalized);
        if (match) {
            return match;
        }
    }
    return types[0] ?? null;
};
}),
"[project]/features/receipts/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptStore",
    ()=>useReceiptStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
// Helper to get current user info
const getCurrentUserInfo = ()=>{
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
    return {
        systemId: currentUserSystemId,
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
const SYSTEM_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
const getCurrentReceiptAuthor = ()=>{
    const userId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.();
    return userId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(userId) : SYSTEM_AUTHOR;
};
const RECEIPT_ENTITY = 'receipts';
const SYSTEM_ID_PREFIX = 'RECEIPT';
const BUSINESS_ID_PREFIX = 'PT';
const BUSINESS_ID_DIGITS = 6;
const normalizeReceiptStatus = (status)=>status === 'cancelled' ? 'cancelled' : 'completed';
const ensureReceiptMetadata = (receipt)=>{
    let mutated = false;
    const updates = {};
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: receipt.payerTypeSystemId,
        name: receipt.payerTypeName
    });
    if (targetGroup) {
        if (receipt.payerTypeSystemId !== targetGroup.systemId) {
            updates.payerTypeSystemId = targetGroup.systemId;
            mutated = true;
        }
        if (receipt.payerTypeName !== targetGroup.name) {
            updates.payerTypeName = targetGroup.name;
            mutated = true;
        }
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: receipt.paymentMethodSystemId,
        name: receipt.paymentMethodName
    });
    if (paymentMethod) {
        if (receipt.paymentMethodSystemId !== paymentMethod.systemId) {
            updates.paymentMethodSystemId = paymentMethod.systemId;
            mutated = true;
        }
        if (receipt.paymentMethodName !== paymentMethod.name) {
            updates.paymentMethodName = paymentMethod.name;
            mutated = true;
        }
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: receipt.accountSystemId,
        branchSystemId: receipt.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? receipt.paymentMethodName
    });
    if (account && receipt.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickReceiptType"])({
        systemId: receipt.paymentReceiptTypeSystemId,
        name: receipt.paymentReceiptTypeName
    });
    if (receiptType) {
        if (receipt.paymentReceiptTypeSystemId !== receiptType.systemId) {
            updates.paymentReceiptTypeSystemId = receiptType.systemId;
            mutated = true;
        }
        if (receipt.paymentReceiptTypeName !== receiptType.name) {
            updates.paymentReceiptTypeName = receiptType.name;
            mutated = true;
        }
    }
    if (!receipt.customerName && receipt.payerName) {
        updates.customerName = receipt.payerName;
        mutated = true;
    }
    if (!receipt.customerSystemId && receipt.payerSystemId) {
        updates.customerSystemId = receipt.payerSystemId;
        mutated = true;
    }
    return mutated ? {
        ...receipt,
        ...updates
    } : receipt;
};
const backfillReceiptMetadata = (receipts)=>{
    let mutated = false;
    const updated = receipts.map((receipt)=>{
        const normalized = ensureReceiptMetadata(receipt);
        if (normalized !== receipt) {
            mutated = true;
        }
        return normalized;
    });
    return mutated ? updated : receipts;
};
const initialReceipts = backfillReceiptMetadata(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"].map((receipt)=>({
        ...receipt,
        status: normalizeReceiptStatus(receipt.status)
    })));
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialReceipts, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialReceipts, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(RECEIPT_ENTITY, systemIdCounter));
};
const ensureReceiptBusinessId = (receipts, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = receipts.map((receipt)=>receipt.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useReceiptStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeWithSelector"])((set, get)=>({
        data: initialReceipts,
        businessIdCounter,
        systemIdCounter,
        add: (item)=>{
            let createdReceipt = null;
            set((state)=>{
                const systemId = getNextSystemId();
                const id = ensureReceiptBusinessId(state.data, item.id);
                const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
                const newReceipt = {
                    ...item,
                    systemId,
                    id,
                    createdBy,
                    createdAt: item.createdAt || new Date().toISOString(),
                    status: normalizeReceiptStatus(item.status),
                    orderAllocations: item.orderAllocations ?? []
                };
                const normalizedReceipt = ensureReceiptMetadata(newReceipt);
                createdReceipt = normalizedReceipt;
                return {
                    data: [
                        ...state.data,
                        normalizedReceipt
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            return createdReceipt;
        },
        addMultiple: (items)=>{
            set((state)=>{
                const created = [];
                items.forEach((item)=>{
                    const context = [
                        ...state.data,
                        ...created
                    ];
                    const systemId = getNextSystemId();
                    const id = ensureReceiptBusinessId(context, item.id);
                    const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
                    const newReceipt = {
                        ...item,
                        systemId,
                        id,
                        createdBy,
                        createdAt: item.createdAt || new Date().toISOString(),
                        status: normalizeReceiptStatus(item.status),
                        orderAllocations: item.orderAllocations ?? []
                    };
                    created.push(ensureReceiptMetadata(newReceipt));
                });
                return {
                    data: [
                        ...state.data,
                        ...created
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
        },
        update: (systemId, item)=>{
            set((state)=>({
                    data: state.data.map((r)=>r.systemId === systemId ? {
                            ...item,
                            status: normalizeReceiptStatus(item.status),
                            updatedAt: new Date().toISOString()
                        } : r),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((r)=>r.systemId !== systemId),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        findById: (systemId)=>{
            return get().data.find((r)=>r.systemId === systemId);
        },
        getActive: ()=>{
            return get().data.filter((r)=>r.status !== 'cancelled');
        },
        cancel: (systemId, reason)=>{
            const receipt = get().findById(systemId);
            if (receipt && receipt.status !== 'cancelled') {
                const historyEntry = createHistoryEntry('cancelled', `Đã hủy phiếu thu${reason ? `: ${reason}` : ''}`, {
                    oldValue: 'Hoàn thành',
                    newValue: 'Đã hủy',
                    note: reason
                });
                get().update(systemId, {
                    ...receipt,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    activityHistory: [
                        ...receipt.activityHistory || [],
                        historyEntry
                    ]
                });
            }
        }
    })));
}),
"[project]/features/sales-returns/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    // Phiếu trả hàng đã hoàn tất - Hoàn tiền
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000001'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000001'),
        customerName: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-11-10 09:30',
        reason: 'Sản phẩm lỗi kỹ thuật',
        note: 'Chuột bị lỗi nút click, khách yêu cầu hoàn tiền',
        notes: 'Đã kiểm tra và xác nhận lỗi từ nhà sản xuất',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
                productName: 'Chuột Logitech MX Master 3',
                returnQuantity: 1,
                unitPrice: 2000000,
                totalValue: 2000000,
                note: 'Lỗi nút click trái'
            }
        ],
        totalReturnValue: 2000000,
        isReceived: true,
        exchangeItems: [],
        subtotalNew: 0,
        shippingFeeNew: 0,
        grandTotalNew: 0,
        finalAmount: -2000000,
        refundMethod: 'Tiền mặt',
        refundAmount: 2000000,
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000001'),
        creatorSystemId: SEED_AUTHOR,
        creatorName: 'Nguyễn Văn A',
        ...buildAuditFields('2025-11-10T09:30:00Z')
    },
    // Phiếu trả hàng - Đổi hàng
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000002'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000003'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000003'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000003'),
        customerName: 'Anh Trần Minh Hoàng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-11-15 14:00',
        reason: 'Đổi sang sản phẩm khác',
        note: 'Khách muốn đổi iPad Air sang iPad Pro',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'),
                productName: 'Máy tính bảng iPad Air',
                returnQuantity: 1,
                unitPrice: 18000000,
                totalValue: 18000000,
                note: 'Đổi lên model cao hơn'
            }
        ],
        totalReturnValue: 18000000,
        isReceived: true,
        exchangeItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000011'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000011'),
                productName: 'Máy tính bảng iPad Pro 12.9"',
                quantity: 1,
                unitPrice: 28000000,
                discount: 0,
                discountType: 'fixed'
            }
        ],
        subtotalNew: 28000000,
        shippingFeeNew: 0,
        grandTotalNew: 28000000,
        finalAmount: 10000000,
        payments: [
            {
                method: 'Chuyển khoản',
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000002'),
                amount: 10000000
            }
        ],
        creatorSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        creatorName: 'Trần Thị B',
        ...buildAuditFields('2025-11-15T14:00:00Z')
    },
    // Phiếu trả hàng - Chưa nhận hàng
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000003'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000006'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000005'),
        customerName: 'Chị Nguyễn Thị Hương',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-12-05 11:00',
        reason: 'Sản phẩm không đúng mô tả',
        note: 'Khách phản ánh màu sắc laptop không đúng như hình',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
                productName: 'Laptop Dell Inspiron 15',
                returnQuantity: 1,
                unitPrice: 15000000,
                totalValue: 15000000,
                note: 'Khách muốn đổi màu bạc sang màu đen'
            }
        ],
        totalReturnValue: 15000000,
        isReceived: false,
        exchangeItems: [],
        subtotalNew: 0,
        shippingFeeNew: 0,
        grandTotalNew: 0,
        finalAmount: -15000000,
        deliveryMethod: 'Dịch vụ giao hàng',
        shippingPartnerId: 'GHN',
        creatorSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
        creatorName: 'Phạm Văn D',
        ...buildAuditFields('2025-12-05T11:00:00Z')
    },
    // Phiếu trả hàng - Hoàn tiền một phần
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000004'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000007'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000006'),
        customerName: 'Anh Phạm Văn Tùng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-12-07 16:30',
        reason: 'Trả một phần đơn hàng',
        note: 'Khách chỉ giữ lại chuột, trả webcam',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'),
                productName: 'Webcam Logitech C920',
                returnQuantity: 1,
                unitPrice: 1200000,
                totalValue: 1200000,
                note: 'Không cần dùng webcam'
            }
        ],
        totalReturnValue: 1200000,
        isReceived: true,
        exchangeItems: [],
        subtotalNew: 0,
        shippingFeeNew: 0,
        grandTotalNew: 0,
        finalAmount: -1200000,
        refunds: [
            {
                method: 'Tiền mặt',
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000001'),
                amount: 1200000
            }
        ],
        creatorSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004'),
        creatorName: 'Võ Thị F',
        ...buildAuditFields('2025-12-07T16:30:00Z')
    },
    // Phiếu trả hàng - Đổi + Hoàn tiền chênh lệch
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000005'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000010'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000010'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000009'),
        customerName: 'Anh Đỗ Văn Hùng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-12-09 10:00',
        reason: 'Đổi sang model cũ hơn',
        note: 'Khách muốn đổi AirPods Pro sang AirPods 3, lấy lại tiền chênh lệch',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'),
                productName: 'Tai nghe AirPods Pro',
                returnQuantity: 1,
                unitPrice: 5000000,
                totalValue: 5000000,
                note: 'Đổi xuống model thấp hơn'
            }
        ],
        totalReturnValue: 5000000,
        isReceived: true,
        exchangeItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000012'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000012'),
                productName: 'Tai nghe AirPods 3',
                quantity: 1,
                unitPrice: 4000000,
                discount: 0,
                discountType: 'fixed'
            }
        ],
        subtotalNew: 4000000,
        shippingFeeNew: 0,
        grandTotalNew: 4000000,
        finalAmount: -1000000,
        refunds: [
            {
                method: 'Tiền mặt',
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000001'),
                amount: 1000000
            }
        ],
        creatorSystemId: SEED_AUTHOR,
        creatorName: 'Nguyễn Văn A',
        ...buildAuditFields('2025-12-09T10:00:00Z')
    }
];
// Reminder constant để giữ `createdAt/createdBy` trong file, tránh quên audit metadata khi bổ sung seed thật.
const __salesReturnMetadataReminder = [
    'createdAt',
    'createdBy'
];
void __salesReturnMetadataReminder;
}),
"[project]/features/payments/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PAYMENT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PC000001'),
        date: '2024-11-12',
        amount: 2000000,
        recipientTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHACUNGCAP'),
        recipientTypeName: 'Nhà cung cấp',
        recipientName: 'Công ty TNHH ABC',
        recipientSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SUPPLIER000001'),
        description: 'Thanh toán tiền hàng nhập kho',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CHUYENKHOAN'),
        paymentMethodName: 'Chuyển khoản',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000002'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT_PURCHASE'),
        paymentReceiptTypeName: 'Mua hàng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-12T09:00:00Z',
        status: 'completed',
        category: 'purchase',
        affectsDebt: false,
        runningBalance: 501000000
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PAYMENT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PC000002'),
        date: '2024-11-13',
        amount: 1500000,
        recipientTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHANVIEN'),
        recipientTypeName: 'Nhân viên',
        recipientName: 'Lê Văn C',
        recipientSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001'),
        description: 'Tạm ứng lương tháng 11',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('TIENMAT'),
        paymentMethodName: 'Tiền mặt',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000001'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT_SALARY'),
        paymentReceiptTypeName: 'Chi lương',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-13T15:00:00Z',
        status: 'completed',
        category: 'salary',
        affectsDebt: false,
        runningBalance: 1730738671
    }
];
}),
"[project]/features/payments/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentStore",
    ()=>usePaymentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
// Helper to get current user info
const getCurrentUserInfo = ()=>{
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
    return {
        systemId: currentUserSystemId,
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
const PAYMENT_ENTITY = 'payments';
const SYSTEM_ID_PREFIX = 'PAYMENT';
const BUSINESS_ID_PREFIX = 'PC';
const BUSINESS_ID_DIGITS = 6;
const PURCHASE_ORDER_SYSTEM_PREFIX = 'PURCHASE';
const PURCHASE_ORDER_BUSINESS_PREFIX = 'PO';
const normalizePaymentStatus = (status)=>status === 'cancelled' ? 'cancelled' : 'completed';
const normalizePayment = (payment)=>({
        ...payment,
        status: normalizePaymentStatus(payment.status)
    });
const ensurePaymentMetadata = (payment)=>{
    let mutated = false;
    const updates = {};
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: payment.recipientTypeSystemId,
        name: payment.recipientTypeName
    });
    if (targetGroup) {
        if (payment.recipientTypeSystemId !== targetGroup.systemId) {
            updates.recipientTypeSystemId = targetGroup.systemId;
            mutated = true;
        }
        if (payment.recipientTypeName !== targetGroup.name) {
            updates.recipientTypeName = targetGroup.name;
            mutated = true;
        }
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: payment.paymentMethodSystemId,
        name: payment.paymentMethodName
    });
    if (paymentMethod) {
        if (payment.paymentMethodSystemId !== paymentMethod.systemId) {
            updates.paymentMethodSystemId = paymentMethod.systemId;
            mutated = true;
        }
        if (payment.paymentMethodName !== paymentMethod.name) {
            updates.paymentMethodName = paymentMethod.name;
            mutated = true;
        }
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: payment.accountSystemId,
        branchSystemId: payment.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? payment.paymentMethodName
    });
    if (account && payment.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentType"])({
        systemId: payment.paymentReceiptTypeSystemId,
        name: payment.paymentReceiptTypeName
    });
    if (paymentType) {
        if (payment.paymentReceiptTypeSystemId !== paymentType.systemId) {
            updates.paymentReceiptTypeSystemId = paymentType.systemId;
            mutated = true;
        }
        if (payment.paymentReceiptTypeName !== paymentType.name) {
            updates.paymentReceiptTypeName = paymentType.name;
            mutated = true;
        }
    }
    const normalizedGroupName = targetGroup?.name?.trim().toLowerCase();
    if (normalizedGroupName === 'khách hàng') {
        if (!payment.customerName && payment.recipientName) {
            updates.customerName = payment.recipientName;
            mutated = true;
        }
        if (!payment.customerSystemId && payment.recipientSystemId) {
            updates.customerSystemId = payment.recipientSystemId;
            mutated = true;
        }
    }
    return mutated ? {
        ...payment,
        ...updates
    } : payment;
};
const backfillPaymentMetadata = (payments)=>{
    let mutated = false;
    const updated = payments.map((payment)=>{
        const normalized = ensurePaymentMetadata(payment);
        if (normalized !== payment) {
            mutated = true;
        }
        return normalized;
    });
    return mutated ? updated : payments;
};
const initialPayments = backfillPaymentMetadata(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"].map(normalizePayment));
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialPayments, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialPayments, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(PAYMENT_ENTITY, systemIdCounter));
};
const ensurePaymentBusinessId = (payments, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = payments.map((payment)=>payment.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const reconcileLinkedDocuments = (payment)=>{
    if (!payment.originalDocumentId) {
        return payment;
    }
    const normalizedDocId = payment.originalDocumentId.toUpperCase();
    const nextPayment = {
        ...payment
    };
    if (!nextPayment.purchaseOrderSystemId && normalizedDocId.startsWith(PURCHASE_ORDER_SYSTEM_PREFIX)) {
        nextPayment.purchaseOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(payment.originalDocumentId);
    }
    if (!nextPayment.purchaseOrderId && normalizedDocId.startsWith(PURCHASE_ORDER_BUSINESS_PREFIX)) {
        nextPayment.purchaseOrderId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(payment.originalDocumentId);
    }
    return nextPayment;
};
const buildPayment = (input, existingPayments)=>{
    const systemId = getNextSystemId();
    const id = ensurePaymentBusinessId(existingPayments, input.id);
    const basePayment = {
        ...input,
        systemId,
        id,
        createdAt: input.createdAt || new Date().toISOString(),
        status: normalizePaymentStatus(input.status)
    };
    return reconcileLinkedDocuments(basePayment);
};
const usePaymentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: initialPayments,
        businessIdCounter,
        systemIdCounter,
        add: (item)=>{
            let createdPayment = null;
            set((state)=>{
                const newPayment = buildPayment(item, state.data);
                createdPayment = newPayment;
                return {
                    data: [
                        ...state.data,
                        newPayment
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            return createdPayment;
        },
        addMultiple: (items)=>{
            set((state)=>{
                const created = [];
                items.forEach((item)=>{
                    const context = [
                        ...state.data,
                        ...created
                    ];
                    const payment = buildPayment(item, context);
                    created.push(payment);
                });
                return {
                    data: [
                        ...state.data,
                        ...created
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
        },
        update: (systemId, item)=>{
            set((state)=>({
                    data: state.data.map((payment)=>payment.systemId === systemId ? reconcileLinkedDocuments({
                            ...item,
                            systemId,
                            status: normalizePaymentStatus(item.status),
                            updatedAt: new Date().toISOString()
                        }) : payment),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((payment)=>payment.systemId !== systemId),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        findById: (systemId)=>{
            return get().data.find((payment)=>payment.systemId === systemId);
        },
        getActive: ()=>{
            return get().data.filter((payment)=>payment.status !== 'cancelled');
        },
        cancel: (systemId, reason)=>{
            const payment = get().findById(systemId);
            if (payment && payment.status !== 'cancelled') {
                const historyEntry = createHistoryEntry('cancelled', `Đã hủy phiếu chi${reason ? `: ${reason}` : ''}`, {
                    oldValue: 'Hoàn thành',
                    newValue: 'Đã hủy',
                    note: reason
                });
                get().update(systemId, {
                    ...payment,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    activityHistory: [
                        ...payment.activityHistory || [],
                        historyEntry
                    ]
                });
            }
        }
    }));
}),
"[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPaymentDocument",
    ()=>createPaymentDocument,
    "createReceiptDocument",
    ()=>createReceiptDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const asBusinessIdOrUndefined = (value)=>{
    if (!value) {
        return undefined;
    }
    return typeof value === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(value) : value;
};
const createReceiptDocument = (options)=>{
    if (!options.branchSystemId) {
        return {
            document: null,
            error: 'Thiếu mã chi nhánh khi tạo phiếu thu.'
        };
    }
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.payerTargetGroupSystemId,
        name: options.payerTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu thu.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức thu tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: options.accountSystemId,
        preferredType: options.accountPreference,
        branchSystemId: options.branchSystemId,
        paymentMethodName: paymentMethod.name
    });
    if (!account) {
        return {
            document: null,
            error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu thu.'
        };
    }
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickReceiptType"])({
        systemId: options.receiptTypeSystemId,
        name: options.receiptTypeName
    });
    if (!receiptType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu thu.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
    const payload = {
        date: timestamp,
        amount: options.amount,
        payerTypeSystemId: targetGroup.systemId,
        payerTypeName: targetGroup.name,
        payerName: options.customerName,
        payerSystemId: options.customerSystemId,
        description: options.description,
        paymentMethodSystemId: paymentMethod.systemId,
        paymentMethodName: paymentMethod.name,
        accountSystemId: account.systemId,
        paymentReceiptTypeSystemId: receiptType.systemId,
        paymentReceiptTypeName: receiptType.name,
        branchSystemId: options.branchSystemId,
        branchName: options.branchName,
        createdBy: options.createdBy,
        createdAt: timestamp,
        status: options.status ?? 'completed',
        category: options.category,
        originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
        linkedOrderSystemId: options.linkedOrderSystemId,
        linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
        linkedWarrantySystemId: options.linkedWarrantySystemId,
        linkedComplaintSystemId: options.linkedComplaintSystemId,
        customerSystemId: options.customerSystemId,
        customerName: options.customerName,
        affectsDebt: options.affectsDebt ?? true
    };
    const receipt = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().add(payload);
    return {
        document: receipt
    };
};
const createPaymentDocument = (options)=>{
    if (!options.branchSystemId) {
        return {
            document: null,
            error: 'Thiếu mã chi nhánh khi tạo phiếu chi.'
        };
    }
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.recipientTargetGroupSystemId,
        name: options.recipientTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu chi.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức chi tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: options.accountSystemId,
        preferredType: options.accountPreference,
        branchSystemId: options.branchSystemId,
        paymentMethodName: paymentMethod.name
    });
    if (!account) {
        return {
            document: null,
            error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu chi.'
        };
    }
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentType"])({
        systemId: options.paymentTypeSystemId,
        name: options.paymentTypeName
    });
    if (!paymentType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu chi.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
    const payload = {
        date: timestamp,
        amount: options.amount,
        recipientTypeSystemId: targetGroup.systemId,
        recipientTypeName: targetGroup.name,
        recipientName: options.recipientName,
        recipientSystemId: options.recipientSystemId,
        description: options.description,
        paymentMethodSystemId: paymentMethod.systemId,
        paymentMethodName: paymentMethod.name,
        accountSystemId: account.systemId,
        paymentReceiptTypeSystemId: paymentType.systemId,
        paymentReceiptTypeName: paymentType.name,
        branchSystemId: options.branchSystemId,
        branchName: options.branchName,
        createdBy: options.createdBy,
        createdAt: timestamp,
        status: options.status ?? 'completed',
        category: options.category,
        originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
        linkedOrderSystemId: options.linkedOrderSystemId,
        linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
        linkedWarrantySystemId: options.linkedWarrantySystemId,
        linkedComplaintSystemId: options.linkedComplaintSystemId,
        customerSystemId: options.customerSystemId,
        customerName: options.customerName ?? options.recipientName,
        affectsDebt: options.affectsDebt ?? true
    };
    const payment = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState().add(payload);
    return {
        document: payment
    };
};
}),
"[project]/features/settings/shipping/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('GHN'),
        name: 'Giao Hàng Nhanh',
        logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-En-Orange.png',
        description: 'Kết nối giao hàng, thu hộ chuyên nghiệp trải dài mọi miền đất nước.',
        phone: '1900 636677',
        address: '405/15 Xô Viết Nghệ Tĩnh, P. 24, Q. Bình Thạnh, TP.HCM',
        contactPerson: 'Trần Văn An',
        status: 'Đang hợp tác',
        services: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('53320'),
                name: 'Hàng nhẹ'
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('53321'),
                name: 'Chuẩn'
            }
        ],
        isConnected: true,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('account_name'),
                    label: 'Tên tài khoản',
                    placeholder: 'Tài khoản 1',
                    required: true
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('token'),
                    label: 'Mã Token tài khoản Giao Hàng Nhanh',
                    placeholder: 'Sao chép và dán Token vào đây',
                    required: true
                }
            ],
            payerOptions: [
                'customer',
                'shop'
            ],
            additionalServices: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('pickup_type'),
                    label: 'Hình thức lấy hàng',
                    type: 'radio',
                    options: [
                        'Tại bưu cục',
                        'Tại kho hàng'
                    ]
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('insurance'),
                    label: 'Bảo hiểm hàng hóa',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('partial_delivery'),
                    label: 'Giao hàng 1 phần',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('merge_delivery'),
                    label: 'Gộp kiện',
                    type: 'checkbox',
                    tooltip: 'Dịch vụ gộp nhiều kiện hàng thành một gói vận chuyển duy nhất.'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('cod_failed_collect'),
                    label: 'Giao thất bại - thu tiền',
                    type: 'checkbox'
                }
            ]
        },
        credentials: {
            token: 'mock-ghn-token-from-user-settings',
            account_name: 'Tài khoản 1'
        },
        configuration: {
            payer: 'shop',
            pickup_type: 'Tại kho hàng'
        },
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-10T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VTP'),
        name: 'Viettel Post',
        logoUrl: 'https://viettelpost.com.vn/wp-content/uploads/2021/01/logo-viettel-post.png',
        description: 'Dịch vụ nhận gửi, vận chuyển và phát nhanh bằng đường bộ.',
        phone: '1900 8095',
        address: 'Số 1 Giang Văn Minh, P. Kim Mã, Q. Ba Đình, Hà Nội',
        contactPerson: 'Lê Thị Bình',
        status: 'Đang hợp tác',
        services: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VCN'),
                name: 'Giao hàng nhanh'
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VCP'),
                name: 'TMĐT Tiết Kiệm thỏa thuận'
            }
        ],
        isConnected: true,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('account_name'),
                    label: 'Tên tài khoản',
                    placeholder: 'Tài khoản 1',
                    required: true
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('email'),
                    label: 'Email tài khoản',
                    placeholder: 'nhlpkgx@gmail.com',
                    required: true,
                    type: 'email'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('phone'),
                    label: 'Số điện thoại',
                    placeholder: '0981239686',
                    required: true
                }
            ],
            payerOptions: [
                'shop',
                'customer'
            ],
            additionalServices: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('report'),
                    label: 'Báo phát',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('cod_check'),
                    label: 'Đồng kiểm',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('at_point'),
                    label: 'Giao bưu phẩm tại điểm giao dịch',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('high_value'),
                    label: 'Hàng giá trị cao',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('fragile'),
                    label: 'Hàng lạnh',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('return_doc'),
                    label: 'Hoàn chứng từ',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('return_bill'),
                    label: 'Hoàn cước chiều đi',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('cod_collect_fee'),
                    label: 'Thu tiền xem hàng',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('return_doc_bidirectional'),
                    label: 'Hoàn cước hai chiều',
                    type: 'checkbox'
                }
            ]
        },
        credentials: {
            account_name: 'Tài khoản 1',
            email: 'nhlpkgx@gmail.com',
            phone: '0981239686'
        },
        configuration: {
            payer: 'customer'
        },
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-11T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('GHTK'),
        name: 'Giao Hàng Tiết Kiệm',
        logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-Green-Slogan-Eng.png',
        description: 'Dịch vụ giao hàng thu tiền hộ; tốc độ nhanh, phủ sóng toàn quốc.',
        phone: '1900 6092',
        address: 'Tòa nhà VTV, Số 8 Phạm Hùng, P. Mễ Trì, Q. Nam Từ Liêm, Hà Nội',
        contactPerson: 'Nguyễn Hùng Cường',
        status: 'Đang hợp tác',
        services: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('road'),
                name: 'Gói tiết kiệm'
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('fly'),
                name: 'Đường bay'
            }
        ],
        isConnected: true,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('email'),
                    label: 'Email đăng nhập',
                    placeholder: 'trendtech686@gmail.com',
                    required: true,
                    type: 'email'
                }
            ],
            payerOptions: [
                'shop',
                'customer'
            ],
            additionalServices: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('deliver_option'),
                    label: 'Dự kiến giao hàng',
                    type: 'select',
                    options: [
                        'Sáng (9:00-12:00)',
                        'Chiều (14:00-18:00)'
                    ],
                    placeholder: 'Chọn ca giao hàng'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('pick_option'),
                    label: 'Hẹn ca lấy giao hàng',
                    type: 'select',
                    options: [
                        'Sáng (9:00-12:00)',
                        'Chiều (14:00-18:00)'
                    ],
                    placeholder: 'Chọn ca giao hàng'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('transport'),
                    label: 'Vận chuyển bằng',
                    type: 'radio',
                    options: [
                        'Đường bộ',
                        'Đường bay'
                    ]
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_postoffice'),
                    label: 'Gửi hàng tại bưu cục',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_fragile'),
                    label: 'Hàng dễ vỡ',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_check'),
                    label: 'Đồng kiểm',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_shop_call'),
                    label: 'Goi shop khi gặp vấn đề',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_fullbox'),
                    label: 'Hàng nguyên hộp',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_part_deliver'),
                    label: 'Giao hàng 1 phần chọn sản phẩm',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_part_return'),
                    label: 'Giao hàng 1 phần đổi trả hàng',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_document'),
                    label: 'Thư, tài liệu',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_cod_fail_charge'),
                    label: 'Thu tiền hủy hàng',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_food_agri'),
                    label: 'Nông sản/thực phẩm khô',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_fresh_food'),
                    label: 'Thực phẩm tươi',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_not_stackable'),
                    label: 'Hàng không xếp chồng',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('is_plant'),
                    label: 'Hàng cây cối',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('referral_email'),
                    label: 'Email nhân viên giới thiệu',
                    type: 'text',
                    gridSpan: 2
                }
            ]
        },
        credentials: {
            email: 'trendtech686@gmail.com'
        },
        configuration: {
            payer: 'customer',
            transport: 'Đường bộ'
        },
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-12T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SPX'),
        name: 'SPX Express',
        logoUrl: 'https://logowik.com/content/uploads/images/spx-express8724.logowik.com.webp',
        description: 'Giải pháp vận chuyển thông minh, nhanh chóng, an toàn, tiết kiệm.',
        phone: '1900 1221',
        address: 'Tầng 17, Tòa nhà Sonatus, 15 Lê Thánh Tôn, P. Bến Nghé, Q.1, TP.HCM',
        status: 'Đang hợp tác',
        services: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('standard'),
                name: 'Gói chuẩn'
            }
        ],
        isConnected: true,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('userId'),
                    label: 'Mã khách hàng (User ID)',
                    placeholder: '36701998557837',
                    required: true
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('secretKey'),
                    label: 'Mã khóa (Secret Key)',
                    placeholder: 'e23507d5-21e2-4f88-a46e-b3a9bfb48bf7',
                    required: true,
                    type: 'password'
                }
            ],
            payerOptions: [
                'shop',
                'customer'
            ],
            additionalServices: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('return_fee'),
                    label: 'Thu phí từ chối nhận đơn',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('send_at_post'),
                    label: 'Gửi hàng tại bưu cục',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('referral_email'),
                    label: 'Email nhân viên giới thiệu',
                    type: 'text',
                    gridSpan: 2
                }
            ]
        },
        credentials: {
            userId: '36701998557837',
            secretKey: 'e23507d5-21e2-4f88-a46e-b3a9bfb48bf7'
        },
        configuration: {
            payer: 'customer'
        },
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-13T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('JT'),
        name: 'J&T Express',
        logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-JT-Express-V-Red.png',
        description: 'Hỗ trợ các hoạt động giao nhận hàng hóa nhanh chóng.',
        phone: '1900 1088',
        address: 'Tòa nhà Pico Plaza, 20 Cộng Hòa, P. 12, Q. Tân Bình, TP.HCM',
        status: 'Đang hợp tác',
        services: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('EZ'),
                name: 'Gói chuẩn'
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('J&T Super'),
                name: 'Dịch vụ siêu giao hàng'
            }
        ],
        isConnected: true,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('customer_id'),
                    label: 'Mã khách hàng',
                    placeholder: '024LC15753',
                    required: true
                }
            ],
            payerOptions: [],
            additionalServices: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('payer'),
                    label: 'Người trả phí',
                    type: 'select',
                    options: [
                        'Người gửi thanh toán cuối tháng'
                    ]
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('insurance'),
                    label: 'Bảo hiểm hàng hoá',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('partial_delivery'),
                    label: 'Giao hàng 1 phần',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('send_at_post'),
                    label: 'Gửi hàng tại bưu cục',
                    type: 'checkbox'
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('referral_email'),
                    label: 'Email nhân viên giới thiệu',
                    type: 'text',
                    gridSpan: 2
                }
            ]
        },
        credentials: {
            customer_id: '024LC15753'
        },
        configuration: {
            partial_delivery: true
        },
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-14T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('NINJAVAN'),
        name: 'Ninja Van',
        logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Ninja-Van.png',
        description: 'Cung cấp dịch vụ giao hàng vượt trội dành cho các doanh nghiệp.',
        phone: '1900 886 877',
        address: '117/2D1 Hồ Văn Long, P. Tân Tạo, Q. Bình Tân, TP.HCM',
        status: 'Ngừng hợp tác',
        services: [],
        isConnected: false,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('client_id'),
                    label: 'Client ID',
                    placeholder: '',
                    required: true
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('client_key'),
                    label: 'Client Key',
                    placeholder: '',
                    required: true,
                    type: 'password'
                }
            ],
            payerOptions: [],
            additionalServices: []
        },
        credentials: {},
        configuration: {},
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-15T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VNPOST'),
        name: 'Vietnam Post',
        logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-VNPost.png',
        description: 'Cung cấp dịch vụ chuyển phát nhanh EMS và chuyển phát bưu kiện.',
        phone: '1900 54 54 81',
        address: 'Số 05 Phạm Hùng, P. Mỹ Đình, Q. Nam Từ Liêm, Hà Nội',
        status: 'Ngừng hợp tác',
        services: [],
        isConnected: false,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('username'),
                    label: 'Username',
                    placeholder: '',
                    required: true
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('password'),
                    label: 'Password',
                    placeholder: '',
                    required: true,
                    type: 'password'
                }
            ],
            payerOptions: [],
            additionalServices: []
        },
        credentials: {},
        configuration: {},
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-16T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('DVVC00000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('AHAMOVE'),
        name: 'Ahamove',
        logoUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/91/b6/23/91b6238b-6f81-817a-5192-3c5825788899/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
        description: 'Dịch vụ giao hàng nội thành siêu tốc.',
        phone: '1900 545411',
        address: 'Tầng 1, Tòa nhà Rivera Park, 7/28 Thành Thái, P. 14, Q. 10, TP.HCM',
        status: 'Ngừng hợp tác',
        services: [],
        isConnected: false,
        config: {
            credentialFields: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('mobile'),
                    label: 'Số điện thoại',
                    placeholder: '',
                    required: true
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('api_key'),
                    label: 'API Key',
                    placeholder: '',
                    required: true,
                    type: 'password'
                }
            ],
            payerOptions: [],
            additionalServices: []
        },
        credentials: {},
        configuration: {},
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-02-17T08:00:00Z'
        })
    }
];
}),
"[project]/features/settings/shipping/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShippingPartnerStore",
    ()=>useShippingPartnerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/shipping/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
;
;
;
// FIX: Replaced import from a non-existent module and replaced it with a mock function.
const _connectPartner = async (partnerId, credentials)=>{
    console.log(`Connecting to ${partnerId} with`, credentials);
    // Simulate success for known partners if they have credentials.
    if (credentials && Object.values(credentials).every((v)=>v)) {
        return {
            success: true,
            message: 'Kết nối thành công.'
        };
    }
    return {
        success: false,
        message: 'Thông tin kết nối không hợp lệ.'
    };
};
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'shipping-partners', {
    // ⚠️ DEPRECATED: Store này không còn dùng để lưu credentials nữa
    // Credentials giờ được lưu trong shipping_partners_config (localStorage)
    // Xem: lib/utils/shipping-config-migration.ts và lib/utils/get-shipping-credentials.ts
    persistKey: 'hrm-shipping-partners' // Keep for backward compatibility
});
const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](baseStore.getState().data, {
    keys: [
        'name',
        'id',
        'phone'
    ],
    threshold: 0.3
});
const storeExtension = {
    searchShippingPartners: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allPartners = baseStore.getState().data;
                const results = query ? fuse.search(query).map((r)=>r.item) : allPartners;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((p)=>({
                            value: p.systemId,
                            label: p.name
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    connect: async (systemId, credentials)=>{
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        // Vui lòng cấu hình trong Settings → Đối tác vận chuyển
        // Credentials sẽ được lưu vào shipping_partners_config
        console.warn('[ShippingPartnerStore] connect() is deprecated. Use shipping_partners_config instead.');
        const partner = baseStore.getState().findById(systemId);
        if (!partner) return {
            success: false,
            message: 'Không tìm thấy đối tác vận chuyển.'
        };
        console.log('[ShippingPartnerStore] Connecting partner:', {
            systemId,
            credentials
        });
        const result = {
            success: true,
            message: 'Kết nối thành công.'
        };
        if (result.success) {
            baseStore.setState((state)=>{
                const newData = state.data.map((p)=>p.systemId === systemId ? {
                        ...p,
                        isConnected: true,
                        status: 'Đang hợp tác',
                        credentials
                    } : p);
                console.log('[ShippingPartnerStore] Updated partner:', newData.find((p)=>p.systemId === systemId));
                return {
                    data: newData
                };
            });
        }
        return result;
    },
    disconnect: (systemId)=>{
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        console.warn('[ShippingPartnerStore] disconnect() is deprecated. Use shipping_partners_config instead.');
        baseStore.setState((state)=>({
                data: state.data.map((p)=>p.systemId === systemId ? {
                        ...p,
                        isConnected: false,
                        status: 'Ngừng hợp tác',
                        credentials: {},
                        configuration: {}
                    } : p)
            }));
    }
};
// Extend the store with custom methods
Object.assign(baseStore.getState(), storeExtension);
const useShippingPartnerStore = baseStore;
}),
"[project]/features/sales-returns/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSalesReturnStore",
    ()=>useSalesReturnStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
// Other stores
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/shipping/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
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
/**
 * ✅ Helper: Expand combo return items to child products
 * When a combo is returned, we need to add stock back to child products
 */ const getReturnStockItems = (returnItems)=>{
    const { findById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const expandedItems = [];
    returnItems.forEach((item)=>{
        const product = findById(item.productSystemId);
        if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
            // Combo → expand to child products
            product.comboItems.forEach((comboItem)=>{
                const childProduct = findById(comboItem.productSystemId);
                expandedItems.push({
                    productSystemId: comboItem.productSystemId,
                    productName: childProduct?.name || 'SP không xác định',
                    quantity: comboItem.quantity * item.returnQuantity
                });
            });
        } else {
            // Regular product
            expandedItems.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                productName: item.productName,
                quantity: item.returnQuantity
            });
        }
    });
    return expandedItems;
};
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'sales-returns', {
    persistKey: 'hrm-sales-returns' // ✅ Enable localStorage persistence
});
const originalAdd = baseStore.getState().add;
const augmentedMethods = {
    addWithSideEffects: (item)=>{
        const orderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.orderSystemId);
        const orderBusinessId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.orderId);
        const customerSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.customerSystemId);
        const branchSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.branchSystemId);
        const creatorSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.creatorSystemId ?? item.creatorId ?? 'SYSTEM');
        const exchangeOrderSystemId = item.exchangeOrderSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.exchangeOrderSystemId) : undefined;
        const accountSystemId = item.accountSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.accountSystemId) : undefined;
        const paymentVoucherSystemId = item.paymentVoucherSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.paymentVoucherSystemId) : undefined;
        const paymentVoucherSystemIds = item.paymentVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"]);
        const receiptVoucherSystemIds = item.receiptVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"]);
        const formattedItems = item.items.map((lineItem)=>({
                ...lineItem,
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(lineItem.productId)
            }));
        const formattedPayments = item.payments?.map((payment)=>({
                ...payment,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(payment.accountSystemId)
            }));
        const formattedRefunds = item.refunds?.map((refund)=>({
                ...refund,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(refund.accountSystemId)
            }));
        const newItemData = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
            orderSystemId,
            orderId: orderBusinessId,
            customerSystemId,
            customerName: item.customerName,
            branchSystemId,
            branchName: item.branchName,
            returnDate: item.returnDate,
            reason: item.reason,
            note: item.note,
            notes: item.notes,
            reference: item.reference,
            items: formattedItems,
            totalReturnValue: item.totalReturnValue,
            isReceived: item.isReceived,
            exchangeItems: item.exchangeItems ?? [],
            exchangeOrderSystemId,
            subtotalNew: item.subtotalNew,
            shippingFeeNew: item.shippingFeeNew,
            discountNew: item.discountNew,
            discountNewType: item.discountNewType,
            grandTotalNew: item.grandTotalNew,
            deliveryMethod: item.deliveryMethod,
            shippingPartnerId: item.shippingPartnerId,
            shippingServiceId: item.shippingServiceId,
            shippingAddress: item.shippingAddress,
            packageInfo: item.packageInfo,
            configuration: item.configuration,
            finalAmount: item.finalAmount,
            refundMethod: item.refundMethod,
            refundAmount: item.refundAmount,
            accountSystemId,
            refunds: formattedRefunds,
            payments: formattedPayments,
            paymentVoucherSystemId,
            paymentVoucherSystemIds,
            receiptVoucherSystemIds,
            creatorSystemId,
            creatorName: item.creatorName
        };
        // --- Side Effects ---
        const { update: updateOrder, findById: findOrderById, add: addOrder } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"].getState();
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const { updateDebt, incrementReturnStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
        const order = findOrderById(newItemData.orderSystemId);
        if (!order) return {
            newReturn: null,
            newOrderSystemId: null
        };
        // ✅ IMPORTANT: Create the return FIRST to get IDs for exchange order
        const newReturn = originalAdd(newItemData);
        if (!newReturn) return {
            newReturn: null,
            newOrderSystemId: null
        };
        // ✅ Update customer return stats
        const totalReturnQty = newItemData.items.reduce((sum, item)=>sum + item.returnQuantity, 0);
        if (totalReturnQty > 0) {
            incrementReturnStats(newItemData.customerSystemId, totalReturnQty);
        }
        let newOrderSystemId;
        // Create a new sales order for the exchange items
        if (newItemData.exchangeItems && newItemData.exchangeItems.length > 0) {
            console.log('🔄 [Sales Return] Creating exchange order...', {
                exchangeItems: newItemData.exchangeItems,
                finalAmount: newItemData.finalAmount,
                payments: newItemData.payments
            });
            // ✅ Calculate payments for exchange order based on sales return logic
            const exchangeOrderPayments = newItemData.finalAmount > 0 && newItemData.payments ? newItemData.payments.map((p, index)=>({
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`PAYMENT-${Date.now()}-${index}`),
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`PAY-${Date.now()}-${index}`),
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd'),
                    method: p.method,
                    amount: p.amount,
                    createdBy: creatorSystemId,
                    description: 'Thanh toán đơn đổi hàng'
                })) : [];
            // If company refunded customer (finalAmount < 0)
            // The exchange order will have COD = grandTotal (shipper collects on delivery)
            // No payments array needed - will be handled by COD in shipping
            // ✅ Determine status and packagings based on delivery method
            let finalMainStatus = 'Đặt hàng';
            let finalDeliveryStatus = 'Chờ đóng gói';
            const packagings = [];
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm');
            // ✅ Helper to get next packaging systemId
            const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
            const allOrders = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"].getState().data;
            const allPackagings = allOrders.flatMap((o)=>o.packagings || []);
            const maxPackagingCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
            let packagingCounter = maxPackagingCounter;
            const getNextPackagingSystemId = ()=>{
                packagingCounter++;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('packaging', packagingCounter));
            };
            // Check if using shipping partner or pickup
            const isPickup = newItemData.deliveryMethod === 'pickup';
            const isShippingPartner = newItemData.shippingPartnerId && newItemData.shippingServiceId;
            if (isPickup) {
                // Nhận tại cửa hàng - Tạo packaging request ngay
                finalMainStatus = 'Đang giao dịch';
                finalDeliveryStatus = 'Chờ đóng gói';
                packagings.push({
                    systemId: getNextPackagingSystemId(),
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                    requestDate: now,
                    requestingEmployeeId: creatorSystemId,
                    requestingEmployeeName: newItemData.creatorName,
                    status: 'Chờ đóng gói',
                    printStatus: 'Chưa in',
                    deliveryStatus: 'Chờ đóng gói'
                });
            } else if (isShippingPartner) {
                // Đẩy qua hãng vận chuyển - Tạo packaging đã đóng gói với tracking
                finalMainStatus = 'Đang giao dịch';
                finalDeliveryStatus = 'Chờ lấy hàng';
                // Get partner info
                const { data: partners } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShippingPartnerStore"].getState();
                const partner = partners.find((p)=>p.systemId === newItemData.shippingPartnerId);
                const service = partner?.services.find((s)=>s.id === newItemData.shippingServiceId);
                packagings.push({
                    systemId: getNextPackagingSystemId(),
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                    requestDate: now,
                    confirmDate: now,
                    requestingEmployeeId: creatorSystemId,
                    requestingEmployeeName: newItemData.creatorName,
                    confirmingEmployeeId: creatorSystemId,
                    confirmingEmployeeName: newItemData.creatorName,
                    status: 'Đã đóng gói',
                    deliveryStatus: 'Chờ lấy hàng',
                    printStatus: 'Chưa in',
                    deliveryMethod: 'Dịch vụ giao hàng',
                    carrier: partner?.name,
                    service: service?.name,
                    trackingCode: newItemData.packageInfo?.trackingCode || `VC${Date.now()}`,
                    shippingFeeToPartner: newItemData.shippingFeeNew,
                    codAmount: 0,
                    payer: 'Người nhận',
                    weight: newItemData.packageInfo?.weight,
                    dimensions: `${newItemData.packageInfo?.length || 0}x${newItemData.packageInfo?.width || 0}x${newItemData.packageInfo?.height || 0}`
                });
            }
            // else: deliver-later → keep default 'Đặt hàng', 'Chờ đóng gói', no packagings
            const newOrderPayload = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                customerSystemId: order.customerSystemId,
                customerName: order.customerName,
                branchSystemId: order.branchSystemId,
                branchName: order.branchName,
                salespersonSystemId: creatorSystemId,
                salesperson: newItemData.creatorName,
                orderDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm'),
                lineItems: newItemData.exchangeItems,
                subtotal: newItemData.subtotalNew,
                shippingFee: newItemData.shippingFeeNew,
                tax: 0,
                // ✅ IMPORTANT: grandTotal should be NET amount (after subtracting return value)
                // grandTotal = subtotalNew + shippingFee - totalReturnValue
                grandTotal: newItemData.finalAmount > 0 ? newItemData.finalAmount : newItemData.grandTotalNew,
                paidAmount: exchangeOrderPayments.reduce((sum, p)=>sum + p.amount, 0),
                // ✅ Store return value info for display
                linkedSalesReturnId: newReturn.id,
                linkedSalesReturnSystemId: newReturn.systemId,
                linkedSalesReturnValue: newItemData.totalReturnValue,
                payments: exchangeOrderPayments,
                notes: `Đơn hàng đổi từ phiếu trả ${newReturn.id} của đơn hàng ${order.id}`,
                sourceSalesReturnId: newReturn.id,
                // ✅ Pass shipping info from form
                deliveryMethod: newItemData.deliveryMethod === 'pickup' ? 'Nhận tại cửa hàng' : 'Dịch vụ giao hàng',
                shippingPartnerId: newItemData.shippingPartnerId,
                shippingServiceId: newItemData.shippingServiceId,
                shippingAddress: newItemData.shippingAddress,
                packageInfo: newItemData.packageInfo,
                configuration: newItemData.configuration,
                // ✅ Add required status fields based on delivery method
                status: finalMainStatus,
                paymentStatus: exchangeOrderPayments.length > 0 ? exchangeOrderPayments.reduce((sum, p)=>sum + p.amount, 0) >= newItemData.grandTotalNew ? 'Thanh toán toàn bộ' : 'Thanh toán 1 phần' : 'Chưa thanh toán',
                deliveryStatus: finalDeliveryStatus,
                printStatus: 'Chưa in',
                stockOutStatus: 'Chưa xuất kho',
                returnStatus: 'Chưa trả hàng',
                codAmount: 0,
                packagings: packagings
            };
            console.log('📦 [Sales Return] New order payload:', newOrderPayload);
            const newOrder = addOrder(newOrderPayload);
            console.log('✅ [Sales Return] New order created:', newOrder);
            if (newOrder) {
                newOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newOrder.systemId);
                // ✅ Save exchange order systemId to sales return
                newItemData.exchangeOrderSystemId = newOrderSystemId;
                console.log('🎉 [Sales Return] Exchange order systemId:', newOrderSystemId);
            } else {
                console.error('❌ [Sales Return] Failed to create exchange order!');
            }
        }
        // Adjust customer debt if needed
        const creditAmount = newItemData.totalReturnValue - newItemData.grandTotalNew - (newItemData.refundAmount || 0);
        if (creditAmount > 0) {
            updateDebt(newItemData.customerSystemId, -creditAmount);
        }
        // ✅ newReturn already created above, use it directly
        // ✅ NOW create vouchers with correct originalDocumentId
        // Handle Financials AFTER creating the return
        const finalAmount = newItemData.finalAmount;
        if (finalAmount < 0 && newItemData.refunds && newItemData.refunds.length > 0) {
            const createdVoucherIds = [];
            newItemData.refunds.forEach((refund)=>{
                if (!refund.amount || refund.amount <= 0) {
                    return;
                }
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentDocument"])({
                    amount: refund.amount,
                    description: `Hoàn tiền đổi/trả hàng từ đơn ${order.id} (Phiếu: ${newReturn.id}) qua ${refund.method}`,
                    recipientName: newItemData.customerName,
                    recipientSystemId: newItemData.customerSystemId,
                    customerSystemId: newItemData.customerSystemId,
                    customerName: newItemData.customerName,
                    paymentMethodName: refund.method,
                    accountSystemId: refund.accountSystemId,
                    paymentTypeName: 'Hoàn tiền khách hàng',
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
                    createdBy: creatorSystemId,
                    originalDocumentId: newReturn.id,
                    linkedSalesReturnSystemId: newReturn.systemId,
                    linkedOrderSystemId: newReturn.orderSystemId,
                    category: 'complaint_refund',
                    affectsDebt: true
                });
                if (error) {
                    console.error('[Sales Return] Failed to create payment voucher:', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu chi hoàn tiền: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
                }
            });
            if (createdVoucherIds.length > 0) {
                baseStore.getState().update(newReturn.systemId, {
                    ...newReturn,
                    paymentVoucherSystemIds: createdVoucherIds
                });
            }
        } else if (finalAmount > 0 && newItemData.payments && newItemData.payments.length > 0) {
            const createdVoucherIds = [];
            newItemData.payments.forEach((payment)=>{
                if (!payment.amount || payment.amount <= 0) {
                    return;
                }
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createReceiptDocument"])({
                    amount: payment.amount,
                    description: `Thu tiền chênh lệch đổi hàng từ đơn ${order.id} (Phiếu: ${newReturn.id})`,
                    customerName: newReturn.customerName,
                    customerSystemId: newItemData.customerSystemId,
                    paymentMethodName: payment.method,
                    accountSystemId: payment.accountSystemId,
                    receiptTypeName: 'Thanh toán cho đơn hàng',
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
                    createdBy: creatorSystemId,
                    originalDocumentId: newReturn.id,
                    linkedSalesReturnSystemId: newReturn.systemId,
                    linkedOrderSystemId: newReturn.orderSystemId,
                    category: 'sale',
                    affectsDebt: false
                });
                if (error) {
                    console.error('[Sales Return] Failed to create receipt voucher:', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu thu đổi hàng: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
                }
            });
            if (createdVoucherIds.length > 0) {
                baseStore.getState().update(newReturn.systemId, {
                    ...newReturn,
                    receiptVoucherSystemIds: createdVoucherIds
                });
            }
        }
        // ✅ Update inventory for returned items ONLY if isReceived = true
        // ✅ For combo products, add stock to child products instead
        if (newReturn.isReceived) {
            console.log('✅ [Sales Return] Updating inventory - items received');
            // Expand combo items to child products
            const stockItems = getReturnStockItems(newReturn.items);
            stockItems.forEach((item)=>{
                if (item.quantity > 0) {
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                    const oldStock = product?.inventoryByBranch[newReturn.branchSystemId] || 0;
                    updateInventory(item.productSystemId, newReturn.branchSystemId, item.quantity); // Add stock back
                    addStockHistory({
                        productId: item.productSystemId,
                        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
                        employeeName: newReturn.creatorName,
                        action: 'Nhập hàng từ khách trả',
                        quantityChange: item.quantity,
                        newStockLevel: oldStock + item.quantity,
                        documentId: newReturn.id,
                        branchSystemId: newReturn.branchSystemId,
                        branch: newReturn.branchName
                    });
                }
            });
        } else {
            console.log('⏸️ [Sales Return] Inventory NOT updated - waiting for receipt confirmation');
        }
        // Update original order's return status
        const previousReturnsForOrder = baseStore.getState().data.filter((r)=>r.orderSystemId === order.systemId);
        const totalReturnedQty = previousReturnsForOrder.flatMap((r)=>r.items).reduce((sum, item)=>sum + item.returnQuantity, 0);
        const totalOrderedQty = order.lineItems.reduce((sum, item)=>sum + item.quantity, 0);
        const newReturnStatus = totalReturnedQty >= totalOrderedQty ? 'Trả hàng toàn bộ' : 'Trả hàng một phần';
        updateOrder(order.systemId, {
            ...order,
            returnStatus: newReturnStatus
        });
        return {
            newReturn,
            newOrderSystemId
        };
    },
    /**
   * ✅ Confirm receipt of returned items and update inventory
   * Use this when isReceived was false initially and items are now received
   * ✅ For combo products, add stock to child products instead
   */ confirmReceipt: (returnSystemId)=>{
        const salesReturn = baseStore.getState().findById(returnSystemId);
        if (!salesReturn) {
            console.error('❌ [Sales Return] Return not found:', returnSystemId);
            return {
                success: false,
                message: 'Không tìm thấy phiếu trả hàng'
            };
        }
        if (salesReturn.isReceived) {
            console.warn('⚠️ [Sales Return] Already received:', returnSystemId);
            return {
                success: false,
                message: 'Hàng đã được nhận trước đó'
            };
        }
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        // ✅ Expand combo items to child products
        const stockItems = getReturnStockItems(salesReturn.items);
        // Update inventory for all returned items (including expanded combo children)
        stockItems.forEach((item)=>{
            if (item.quantity > 0) {
                const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;
                updateInventory(item.productSystemId, salesReturn.branchSystemId, item.quantity);
                addStockHistory({
                    productId: item.productSystemId,
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
                    employeeName: salesReturn.creatorName,
                    action: 'Nhập hàng từ khách trả (xác nhận)',
                    quantityChange: item.quantity,
                    newStockLevel: oldStock + item.quantity,
                    documentId: salesReturn.id,
                    branchSystemId: salesReturn.branchSystemId,
                    branch: salesReturn.branchName
                });
            }
        });
        // Update the return record
        baseStore.getState().update(returnSystemId, {
            ...salesReturn,
            isReceived: true
        });
        console.log('✅ [Sales Return] Receipt confirmed and inventory updated:', returnSystemId);
        return {
            success: true,
            message: 'Đã xác nhận nhận hàng và cập nhật tồn kho'
        };
    }
};
const useSalesReturnStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
useSalesReturnStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
"[project]/features/shipments/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShipmentStore",
    ()=>useShipmentStore
]);
/**
 * Shipment Store - Entity riêng cho vận đơn
 * 
 * ⚠️ ID Format theo ID-GOVERNANCE.md:
 * - SystemId: SHIPMENT000001
 * - BusinessId: VC000001
 * 
 * Relationship: Shipment 1:1 Packaging (via packagingSystemId)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
// ========================================
// CONSTANTS
// ========================================
const SHIPMENT_SYSTEM_ID_PREFIX = 'SHIPMENT';
const SHIPMENT_BUSINESS_ID_PREFIX = 'VC';
// ========================================
// INITIAL SEED DATA
// ========================================
const initialData = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000001'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000001'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        trackingCode: 'GHN000001',
        carrier: 'GHN',
        service: 'Chuẩn',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 25000,
        codAmount: 0,
        payer: 'Người gửi',
        createdAt: '2025-11-01 08:30',
        dispatchedAt: '2025-11-02 08:00',
        deliveredAt: '2025-11-05 15:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000002'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000002'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000002'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        trackingCode: 'JT000245',
        carrier: 'J&T Express',
        service: 'Gói chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 30000,
        codAmount: 5000000,
        payer: 'Người nhận',
        createdAt: '2025-11-03 16:00',
        dispatchedAt: '2025-11-04 09:00'
    },
    // Thêm dữ liệu mẫu mới
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000003'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000005'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        trackingCode: 'GHTK123456',
        carrier: 'GHTK',
        service: 'Nhanh',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 35000,
        codAmount: 12500000,
        payer: 'Người nhận',
        createdAt: '2025-11-08 10:00',
        dispatchedAt: '2025-11-08 14:00',
        deliveredAt: '2025-11-10 11:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000004'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000006'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000006'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        trackingCode: 'VTP789012',
        carrier: 'Viettel Post',
        service: 'Tiêu chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 28000,
        codAmount: 8900000,
        payer: 'Người nhận',
        createdAt: '2025-11-09 09:15',
        dispatchedAt: '2025-11-09 15:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000005'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000007'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000007'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        trackingCode: 'GHN345678',
        carrier: 'GHN',
        service: 'Express',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 45000,
        codAmount: 23800000,
        payer: 'Người nhận',
        createdAt: '2025-11-07 08:00',
        dispatchedAt: '2025-11-07 10:00',
        deliveredAt: '2025-11-08 09:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000006'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000008'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000008'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000008'),
        trackingCode: 'BEST567890',
        carrier: 'Best Express',
        service: 'Tiết kiệm',
        deliveryStatus: 'Chờ lấy hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 22000,
        codAmount: 4500000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 07:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000007'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000009'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000009'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000009'),
        trackingCode: 'NJV901234',
        carrier: 'Ninja Van',
        service: 'Standard',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 32000,
        codAmount: 15600000,
        payer: 'Người gửi',
        createdAt: '2025-11-05 11:00',
        dispatchedAt: '2025-11-05 16:00',
        deliveredAt: '2025-11-07 14:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000008'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000010'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000010'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000010'),
        trackingCode: 'JT567891',
        carrier: 'J&T Express',
        service: 'Siêu tốc',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 55000,
        codAmount: 31200000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 14:00',
        dispatchedAt: '2025-11-10 16:30'
    }
];
// ========================================
// HELPER FUNCTIONS
// ========================================
let shipmentSystemIdCounter = 0;
let shipmentBusinessIdCounter = 0;
function initCounters(shipments) {
    shipmentSystemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(shipments, SHIPMENT_SYSTEM_ID_PREFIX);
    shipmentBusinessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(shipments, SHIPMENT_BUSINESS_ID_PREFIX);
}
function getNextShipmentSystemId() {
    shipmentSystemIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('shipments', shipmentSystemIdCounter);
}
function getNextShipmentBusinessId() {
    shipmentBusinessIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateBusinessId"])('shipments', shipmentBusinessIdCounter);
}
// Initialize counters
initCounters(initialData);
const useShipmentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
        findById: (systemId)=>{
            return get().data.find((s)=>s.systemId === systemId);
        },
        findByPackagingSystemId: (packagingSystemId)=>{
            return get().data.find((s)=>s.packagingSystemId === packagingSystemId);
        },
        findByTrackingCode: (trackingCode)=>{
            return get().data.find((s)=>s.trackingCode === trackingCode);
        },
        createShipment: (data)=>{
            const newShipment = {
                systemId: getNextShipmentSystemId(),
                id: getNextShipmentBusinessId(),
                ...data
            };
            set((state)=>({
                    data: [
                        ...state.data,
                        newShipment
                    ]
                }));
            return newShipment;
        },
        updateShipment: (systemId, updates)=>{
            set((state)=>({
                    data: state.data.map((s)=>s.systemId === systemId ? {
                            ...s,
                            ...updates
                        } : s)
                }));
        },
        deleteShipment: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((s)=>s.systemId !== systemId)
                }));
        },
        getNextSystemId: ()=>getNextShipmentSystemId(),
        getNextBusinessId: ()=>getNextShipmentBusinessId()
    }), {
    name: 'hrm-shipments',
    partialize: (state)=>({
            data: state.data
        }),
    onRehydrateStorage: ()=>(state)=>{
            if (state?.data) {
                initCounters(state.data);
                // ✅ MIGRATION: Merge seed data - add new shipments from initialData if not exist
                const existingIds = new Set(state.data.map((s)=>s.systemId));
                const newShipments = initialData.filter((s)=>!existingIds.has(s.systemId));
                if (newShipments.length > 0) {
                    useShipmentStore.setState((prev)=>({
                            data: [
                                ...prev.data,
                                ...newShipments
                            ]
                        }));
                    initCounters([
                        ...state.data,
                        ...newShipments
                    ]);
                }
            }
        }
}));
}),
"[project]/features/settings/sales/sales-management-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "salesManagementDefaultSettings",
    ()=>salesManagementDefaultSettings,
    "useSalesManagementSettingsStore",
    ()=>useSalesManagementSettingsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const defaultSettings = {
    allowCancelAfterExport: true,
    allowNegativeOrder: true,
    allowNegativeApproval: true,
    allowNegativePacking: true,
    allowNegativeStockOut: true,
    printCopies: '1'
};
const useSalesManagementSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        ...defaultSettings,
        updateSetting: (key, value)=>set((state)=>({
                    ...state,
                    [key]: value
                })),
        reset: ()=>set(()=>({
                    ...defaultSettings
                }))
    }), {
    name: 'sales-management-settings'
}));
const salesManagementDefaultSettings = defaultSettings;
}),
"[project]/features/orders/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrderStore",
    ()=>useOrderStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
// REMOVED: Voucher store no longer exists - using Payment/Receipt stores instead
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
// REMOVED: import type { Voucher } from '../vouchers/types';
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/shipments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/sales/sales-management-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
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
// ✅ Helper to get branch systemId
const getBranchId = (order)=>order.branchSystemId;
const deliveryStatusesBlockedForCancellation = [
    'Đang giao hàng',
    'Đã giao hàng',
    'Chờ giao lại'
];
const IN_STORE_PICKUP_PREFIX = 'INSTORE';
const PACKAGING_CODE_PREFIX = 'DG';
const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
// ✅ Track packaging systemId counter globally
let packagingSystemIdCounter = 0;
// ✅ Initialize counter from all existing packagings across all orders
const _initPackagingCounter = (orders)=>{
    const allPackagings = orders.flatMap((o)=>o.packagings || []);
    packagingSystemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
};
// ✅ Generate next packaging systemId
const getNextPackagingSystemId = ()=>{
    packagingSystemIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('packaging', packagingSystemIdCounter));
};
const getPackagingSuffixFromOrderId = (orderId)=>{
    if (!orderId) return '';
    const rawValue = `${orderId}`;
    const suffix = rawValue.replace(/^[A-Z-]+/, '');
    return suffix || rawValue;
};
// Count only active packagings (not cancelled) for numbering
const _getActivePackagingCount = (packagings)=>{
    return packagings.filter((p)=>p.status !== 'Hủy đóng gói').length;
};
const buildPackagingBusinessId = (orderId, activeIndex, activeCount)=>{
    const suffix = getPackagingSuffixFromOrderId(orderId);
    const baseCode = `${PACKAGING_CODE_PREFIX}${suffix || '000000'}`;
    // Only add suffix if there are multiple active packagings
    if (activeCount > 1 && activeIndex > 0) {
        const paddedIndex = String(activeIndex + 1).padStart(2, '0');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`${baseCode}-${paddedIndex}`);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(baseCode);
};
const getReturnedValueForOrder = (orderSystemId)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesReturnStore"].getState().data.filter((sr)=>sr.orderSystemId === orderSystemId).reduce((sum, sr)=>sum + sr.totalReturnValue, 0);
};
const calculateActualDebt = (order)=>{
    const totalReturnedValue = getReturnedValueForOrder(order.systemId);
    return Math.max(order.grandTotal - totalReturnedValue, 0);
};
const calculateTotalPaid = (payments)=>{
    return payments.reduce((sum, payment)=>sum + payment.amount, 0);
};
const getOrderOutstandingAmount = (order)=>{
    const actualDebt = calculateActualDebt(order);
    const totalPaid = calculateTotalPaid(order.payments ?? []);
    return Math.max(actualDebt - totalPaid, 0);
};
const applyPaymentToOrder = (order, payment)=>{
    const updatedPayments = [
        ...order.payments ?? [],
        payment
    ];
    const totalPaid = calculateTotalPaid(updatedPayments);
    const actualDebt = calculateActualDebt(order);
    let newPaymentStatus = 'Chưa thanh toán';
    if (totalPaid >= actualDebt) {
        newPaymentStatus = 'Thanh toán toàn bộ';
    } else if (totalPaid > 0) {
        newPaymentStatus = 'Thanh toán 1 phần';
    }
    const wasCompleted = order.status === 'Hoàn thành';
    let newStatus = order.status;
    let newCompletedDate = order.completedDate;
    if (newPaymentStatus === 'Thanh toán toàn bộ' && order.deliveryStatus === 'Đã giao hàng') {
        newStatus = 'Hoàn thành';
        newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
        if (!wasCompleted) {
            const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
            incrementOrderStats(order.customerSystemId, order.grandTotal);
        }
    }
    const { updateDebtTransactionPayment } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
    updateDebtTransactionPayment(order.customerSystemId, order.id, payment.amount);
    return {
        ...order,
        payments: updatedPayments,
        paymentStatus: newPaymentStatus,
        status: newStatus,
        completedDate: newCompletedDate,
        paidAmount: totalPaid
    };
};
const shouldAutoAllocateReceipt = (receipt)=>{
    return receipt.status === 'completed' && receipt.affectsDebt && !!receipt.customerSystemId && !receipt.linkedOrderSystemId;
};
const getAllocatedAmount = (receipt)=>{
    return receipt.orderAllocations?.reduce((sum, allocation)=>sum + allocation.amount, 0) ?? 0;
};
const autoAllocateReceiptToOrders = (receipt)=>{
    if (!shouldAutoAllocateReceipt(receipt)) {
        return;
    }
    const remainingAmount = receipt.amount - getAllocatedAmount(receipt);
    if (remainingAmount <= 0) {
        return;
    }
    const candidateOrders = baseStore.getState().data.filter((order)=>order.customerSystemId === receipt.customerSystemId && order.status !== 'Đã hủy').map((order)=>({
            order,
            outstanding: getOrderOutstandingAmount(order)
        })).filter((entry)=>entry.outstanding > 0).sort((a, b)=>{
        const aTime = a.order.orderDate ? new Date(a.order.orderDate).getTime() : 0;
        const bTime = b.order.orderDate ? new Date(b.order.orderDate).getTime() : 0;
        return aTime - bTime;
    });
    if (!candidateOrders.length) {
        return;
    }
    let amountToDistribute = remainingAmount;
    const updatedOrders = new Map();
    const allocationEntries = [];
    for (const { order } of candidateOrders){
        if (amountToDistribute <= 0) {
            break;
        }
        const currentOrderState = updatedOrders.get(order.systemId) ?? order;
        const outstanding = getOrderOutstandingAmount(currentOrderState);
        if (outstanding <= 0) {
            continue;
        }
        const allocationAmount = Math.min(outstanding, amountToDistribute);
        if (allocationAmount <= 0) {
            continue;
        }
        const paymentEntry = {
            systemId: receipt.systemId,
            id: receipt.id,
            date: receipt.date,
            amount: allocationAmount,
            method: receipt.paymentMethodName,
            createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(receipt.createdBy),
            description: receipt.description ?? `Thanh toán từ phiếu thu ${receipt.id}`
        };
        const updatedOrder = applyPaymentToOrder(currentOrderState, paymentEntry);
        updatedOrders.set(order.systemId, updatedOrder);
        allocationEntries.push({
            orderSystemId: order.systemId,
            orderId: order.id,
            amount: allocationAmount
        });
        amountToDistribute -= allocationAmount;
    }
    if (!allocationEntries.length) {
        return;
    }
    baseStore.setState((state)=>{
        const data = state.data.map((order)=>updatedOrders.get(order.systemId) ?? order);
        return {
            data
        };
    });
    const receiptStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
    const latestReceipt = receiptStore.findById(receipt.systemId);
    if (!latestReceipt) {
        return;
    }
    receiptStore.update(receipt.systemId, {
        ...latestReceipt,
        orderAllocations: [
            ...latestReceipt.orderAllocations ?? [],
            ...allocationEntries
        ]
    });
};
const ensureOrderPackagingIdentifiers = (order)=>{
    if (!order.packagings || order.packagings.length === 0) {
        return null;
    }
    // Count only active packagings for proper numbering
    const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
    const activeCount = activePackagings.length;
    let changed = false;
    let activeIndex = 0;
    const updatedPackagings = order.packagings.map((pkg, _idx)=>{
        const isCancelled = pkg.status === 'Hủy đóng gói';
        const hasId = typeof pkg.id === 'string' && pkg.id.trim().length > 0;
        // ✅ Check for temp systemId or old format (PKG_)
        const hasTempOrOldSystemId = pkg.systemId?.startsWith('PKG_TEMP_') || pkg.systemId?.startsWith('PKG_');
        const hasValidSystemId = pkg.systemId?.startsWith(PACKAGING_SYSTEM_ID_PREFIX);
        const shouldFixTracking = pkg.deliveryMethod === 'Nhận tại cửa hàng' && pkg.trackingCode === `${IN_STORE_PICKUP_PREFIX}-`;
        // For cancelled packagings, keep existing ID
        if (isCancelled) {
            if (!hasId || hasTempOrOldSystemId && !hasValidSystemId) {
                // Still need to assign an ID if missing
                const nextPkg = {
                    ...pkg
                };
                if (!hasId) {
                    nextPkg.id = buildPackagingBusinessId(order.id, 0, 1);
                }
                if (hasTempOrOldSystemId && !hasValidSystemId) {
                    nextPkg.systemId = getNextPackagingSystemId();
                }
                changed = true;
                return nextPkg;
            }
            return pkg;
        }
        // For active packagings, use activeIndex for numbering
        const currentActiveIndex = activeIndex;
        activeIndex++;
        if (hasId && !shouldFixTracking && hasValidSystemId) {
            return pkg;
        }
        const nextPkg = {
            ...pkg
        };
        if (!hasId) {
            nextPkg.id = buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            changed = true;
        }
        // ✅ Fix temporary/old systemId to proper format PACKAGE000001
        if (hasTempOrOldSystemId && !hasValidSystemId) {
            nextPkg.systemId = getNextPackagingSystemId();
            changed = true;
        }
        if (shouldFixTracking) {
            const resolvedId = nextPkg.id ?? buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            nextPkg.trackingCode = `${IN_STORE_PICKUP_PREFIX}-${resolvedId}`;
            changed = true;
        }
        return nextPkg;
    });
    return changed ? {
        ...order,
        packagings: updatedPackagings
    } : null;
};
const ensureCancellationAllowed = (order, actionLabel)=>{
    if (!order) return false;
    const { allowCancelAfterExport } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
    if (allowCancelAfterExport) {
        return true;
    }
    const hasLeftWarehouse = order.stockOutStatus === 'Xuất kho toàn bộ' || deliveryStatusesBlockedForCancellation.includes(order.deliveryStatus);
    if (hasLeftWarehouse) {
        alert(`Không thể ${actionLabel} vì đơn hàng đã xuất kho. Vào Cấu hình bán hàng -> Thiết lập quản lý bán hàng và bật "Cho phép hủy đơn hàng sau khi xuất kho".`);
        return false;
    }
    return true;
};
const processLineItemStock = (lineItem, branchSystemId, operation, orderQuantity = 1 // Số lượng đặt của line item
)=>{
    const { findById: findProductById, commitStock, uncommitStock, dispatchStock, completeDelivery, returnStockFromTransit } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId));
    // Xác định danh sách items cần xử lý (SP con nếu combo, hoặc chính SP nếu thường)
    const itemsToProcess = [];
    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
        // Combo: xử lý tất cả SP con
        product.comboItems.forEach((comboItem)=>{
            itemsToProcess.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId),
                quantity: orderQuantity * comboItem.quantity
            });
        });
    } else {
        // Sản phẩm thường
        itemsToProcess.push({
            productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId),
            quantity: orderQuantity
        });
    }
    // Thực hiện operation cho từng item
    itemsToProcess.forEach((item)=>{
        const branchId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId);
        switch(operation){
            case 'commit':
                commitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'uncommit':
                uncommitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'dispatch':
                dispatchStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'complete':
                completeDelivery(item.productSystemId, branchId, item.quantity);
                break;
            case 'return':
                returnStockFromTransit(item.productSystemId, branchId, item.quantity);
                break;
        }
    });
    return itemsToProcess; // Return để có thể dùng cho stock history
};
/**
 * ✅ Helper để lấy danh sách stock items từ line items (mở rộng combo thành SP con)
 * Dùng trong webhook GHTK hoặc các thao tác batch
 */ const getComboStockItems = (lineItems)=>{
    const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const stockItems = [];
    lineItems.forEach((item)=>{
        const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
        if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
            // Combo: mở rộng thành SP con
            product.comboItems.forEach((comboItem)=>{
                stockItems.push({
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId),
                    quantity: item.quantity * comboItem.quantity
                });
            });
        } else {
            // Sản phẩm thường
            stockItems.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                quantity: item.quantity
            });
        }
    });
    return stockItems;
};
const createOrderRefundVoucher = (order, amount, employeeId)=>{
    const lastPositivePayment = [
        ...order.payments ?? []
    ].reverse().find((p)=>p.amount > 0);
    const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentDocument"])({
        amount,
        description: `Hoàn tiền do hủy đơn ${order.id}`,
        recipientName: order.customerName,
        recipientSystemId: order.customerSystemId,
        customerSystemId: order.customerSystemId,
        customerName: order.customerName,
        branchSystemId: order.branchSystemId,
        branchName: order.branchName,
        createdBy: employeeId,
        paymentMethodName: lastPositivePayment?.method || 'Tiền mặt',
        paymentTypeName: 'Hoàn tiền khách hàng',
        originalDocumentId: order.id,
        linkedOrderSystemId: order.systemId,
        affectsDebt: true,
        category: 'other'
    });
    if (!document) {
        console.error('[cancelOrder] Không thể tạo phiếu chi hoàn tiền', error);
        return null;
    }
    return document;
};
const initialData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"].map((o, index)=>{
    const packagings = [];
    if (o.packagingStatus === 'Đóng gói toàn bộ' || o.packagingStatus === 'Chờ xác nhận đóng gói') {
        const hasDeliveryStarted = o.deliveryStatus && o.deliveryStatus !== 'Chờ đóng gói' && o.deliveryStatus !== 'Đã đóng gói';
        const packagingId = `${PACKAGING_CODE_PREFIX}${o.id.substring(2)}`; // DG000001
        const newPkg = {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`PACKAGE${String(index + 1).padStart(6, '0')}`),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(packagingId),
            requestDate: o.orderDate,
            confirmDate: o.packagingStatus === 'Đóng gói toàn bộ' ? o.orderDate : undefined,
            requestingEmployeeId: o.salespersonSystemId,
            requestingEmployeeName: o.salesperson,
            confirmingEmployeeId: o.packagingStatus === 'Đóng gói toàn bộ' ? o.salespersonSystemId : undefined,
            confirmingEmployeeName: o.packagingStatus === 'Đóng gói toàn bộ' ? o.salesperson : undefined,
            status: o.packagingStatus === 'Đóng gói toàn bộ' ? 'Đã đóng gói' : 'Chờ đóng gói',
            printStatus: o.printStatus,
            deliveryMethod: hasDeliveryStarted ? o.deliveryMethod : undefined,
            deliveryStatus: o.deliveryStatus
        };
        if (o.id === 'DH000001' && o.deliveryStatus === 'Đã giao hàng') {
            newPkg.carrier = 'Giao Hàng Nhanh';
            newPkg.trackingCode = 'GHN000001'; // Use shipment tracking code from carrier
            newPkg.deliveredDate = '2025-09-22 14:00';
            newPkg.deliveryMethod = 'Dịch vụ giao hàng';
        }
        if (o.id === 'DH000003' && o.deliveryStatus === 'Đã giao hàng') {
            newPkg.trackingCode = 'VC000003'; // Use shipment business ID for INSTORE
            newPkg.deliveredDate = '2025-08-01 11:00';
            newPkg.deliveryMethod = 'Nhận tại cửa hàng';
        }
        packagings.push(newPkg);
    }
    const { packagingStatus: _packagingStatus, products: _products, ...rest } = o;
    // Transform products array to lineItems
    const lineItems = (o.products || []).map((p, idx)=>({
            systemId: `LINE_${o.id}_${idx + 1}`,
            productSystemId: p.productSystemId || `PROD_${idx}`,
            productId: p.productId || `PROD_${idx}`,
            productName: p.productName || '',
            quantity: p.quantity || 0,
            unitPrice: p.price || 0,
            discount: 0,
            discountType: 'fixed',
            total: p.total || 0
        }));
    return {
        ...rest,
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`ORD${String(index + 1).padStart(8, '0')}`),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`CUST_${index + 1}`),
        paidAmount: o.paidAmount ?? 0,
        packagings,
        lineItems: lineItems.map((l)=>({
                ...l,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(l.systemId),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(l.productSystemId),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(l.productId)
            }))
    };
});
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(initialData, 'orders', {
    businessIdField: 'id',
    persistKey: 'hrm-orders',
    getCurrentUser: ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])());
    }
});
// ✅ MIGRATION: Ensure all orders have paidAmount field (backward compatibility)
baseStore.setState((state)=>({
        data: state.data.map((order)=>({
                ...order,
                paidAmount: order.paidAmount ?? 0
            }))
    }));
// ✅ MIGRATION: Merge seed data - add new orders from initialData if not exist in persisted store
baseStore.setState((state)=>{
    const existingIds = new Set(state.data.map((o)=>o.systemId));
    const newOrders = initialData.filter((o)=>!existingIds.has(o.systemId));
    if (newOrders.length > 0) {
        return {
            data: [
                ...state.data,
                ...newOrders
            ]
        };
    }
    return state;
});
// ✅ MIGRATION: Fix order status - orders with full payment and delivery should be "Hoàn thành"
baseStore.setState((state)=>({
        data: state.data.map((order)=>{
            // If order is already completed or cancelled, skip
            if (order.status === 'Hoàn thành' || order.status === 'Đã hủy') {
                return order;
            }
            // Check if all active packagings are delivered
            const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
            const isAllDelivered = activePackagings.length > 0 && activePackagings.every((p)=>p.deliveryStatus === 'Đã giao hàng');
            // If fully paid and fully delivered, update status to "Hoàn thành"
            if (order.paymentStatus === 'Thanh toán toàn bộ' && (isAllDelivered || order.deliveryStatus === 'Đã giao hàng')) {
                return {
                    ...order,
                    status: 'Hoàn thành',
                    completedDate: order.completedDate || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                };
            }
            return order;
        })
    }));
const originalAdd = baseStore.getState().add;
baseStore.setState({
    add: (item)=>{
        const { commitStock, findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const newItem = originalAdd(item);
        if (newItem) {
            const hydratedPackagings = ensureOrderPackagingIdentifiers(newItem);
            if (hydratedPackagings) {
                Object.assign(newItem, hydratedPackagings);
                baseStore.setState((state)=>({
                        data: state.data.map((order)=>order.systemId === hydratedPackagings.systemId ? hydratedPackagings : order)
                    }));
            }
            newItem.lineItems.forEach((li)=>{
                const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(li.productSystemId));
                // ✅ Xử lý combo: commit stock của SP con thay vì combo
                if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                    product.comboItems.forEach((comboItem)=>{
                        // Commit stock = số lượng combo × số lượng SP con trong combo
                        const totalQuantity = li.quantity * comboItem.quantity;
                        commitStock((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newItem.branchSystemId), totalQuantity);
                    });
                } else {
                    // Sản phẩm thường: commit stock như bình thường
                    commitStock((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(li.productSystemId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newItem.branchSystemId), li.quantity);
                }
            });
            // ✅ Cập nhật lastPurchaseDate khi tạo đơn mới (để SLA/churn risk hoạt động đúng)
            if (newItem.customerSystemId) {
                const { update: updateCustomer, findById: findCustomer } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                const customer = findCustomer(newItem.customerSystemId);
                if (customer) {
                    updateCustomer(newItem.customerSystemId, {
                        lastPurchaseDate: new Date().toISOString().split('T')[0]
                    });
                }
            }
            // ✅ Add activity history entry
            const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo đơn hàng ${newItem.id} cho khách hàng ${newItem.customerName} (Tổng: ${newItem.grandTotal.toLocaleString('vi-VN')}đ)`);
            baseStore.setState((state)=>({
                    data: state.data.map((order)=>order.systemId === newItem.systemId ? {
                            ...order,
                            activityHistory: [
                                historyEntry
                            ]
                        } : order)
                }));
        }
        return newItem;
    }
});
const backfillPackagingIdentifiers = ()=>{
    const currentState = baseStore.getState();
    let changed = false;
    const updatedData = currentState.data.map((order)=>{
        const updatedOrder = ensureOrderPackagingIdentifiers(order);
        if (updatedOrder) {
            changed = true;
            return updatedOrder;
        }
        return order;
    });
    if (changed) {
        baseStore.setState({
            data: updatedData
        });
    }
};
backfillPackagingIdentifiers();
const augmentedMethods = {
    cancelOrder: (systemId, employeeId, options)=>{
        const { reason, restock = true } = options ?? {};
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === systemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy đơn hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const orderToCancel = state.data.find((o)=>o.systemId === systemId);
            if (!orderToCancel || orderToCancel.status === 'Đã hủy') {
                return state;
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            const cancellationReason = reason && reason.trim().length > 0 ? reason.trim() : orderToCancel.cancellationReason || `Hủy bởi ${employee?.fullName || 'Hệ thống'}`;
            // ✅ Uncommit stock (hỗ trợ combo)
            if (restock) {
                orderToCancel.lineItems.forEach((item)=>{
                    processLineItemStock(item, orderToCancel.branchSystemId, 'uncommit', item.quantity);
                });
            }
            const hasDispatchedStock = orderToCancel.stockOutStatus === 'Xuất kho toàn bộ' || [
                'Chờ lấy hàng',
                'Đang giao hàng',
                'Đã giao hàng',
                'Chờ giao lại'
            ].includes(orderToCancel.deliveryStatus);
            // ✅ Return stock from transit (hỗ trợ combo)
            if (restock && hasDispatchedStock) {
                orderToCancel.lineItems.forEach((item)=>{
                    processLineItemStock(item, orderToCancel.branchSystemId, 'return', item.quantity);
                });
            }
            const existingPayments = orderToCancel.payments ?? [];
            const netCollected = existingPayments.reduce((sum, payment)=>sum + payment.amount, 0);
            let refundPaymentEntry = null;
            const refundAmount = netCollected > 0 ? netCollected : 0;
            if (refundAmount > 0) {
                const refundVoucher = createOrderRefundVoucher(orderToCancel, refundAmount, employeeId);
                if (!refundVoucher) {
                    alert('Không thể tạo phiếu chi hoàn tiền. Vui lòng kiểm tra cấu hình tài chính trước khi hủy đơn.');
                    return state;
                }
                refundPaymentEntry = {
                    systemId: refundVoucher.systemId,
                    id: refundVoucher.id,
                    date: refundVoucher.date,
                    amount: -refundAmount,
                    method: refundVoucher.paymentMethodName,
                    createdBy: employeeId,
                    description: `Hoàn tiền khi hủy đơn ${orderToCancel.id}`
                };
            }
            const updatedPayments = refundPaymentEntry ? [
                ...existingPayments,
                refundPaymentEntry
            ] : existingPayments;
            const updatedPaidAmount = Math.max(0, (orderToCancel.paidAmount ?? 0) - refundAmount);
            const updatedPackagings = orderToCancel.packagings.map((pkg)=>{
                if (pkg.status === 'Hủy đóng gói' && pkg.deliveryStatus === 'Đã hủy') {
                    return pkg;
                }
                return {
                    ...pkg,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelDate: now,
                    cancelReason: pkg.cancelReason ?? cancellationReason,
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employee?.fullName || 'Hệ thống'
                };
            });
            const updatedOrder = {
                ...orderToCancel,
                status: 'Đã hủy',
                cancelledDate: now,
                cancellationReason,
                deliveryStatus: 'Đã hủy',
                stockOutStatus: restock ? 'Chưa xuất kho' : orderToCancel.stockOutStatus,
                payments: updatedPayments,
                paidAmount: updatedPaidAmount,
                paymentStatus: refundPaymentEntry ? 'Chưa thanh toán' : orderToCancel.paymentStatus,
                packagings: updatedPackagings,
                cancellationMetadata: {
                    restockItems: restock,
                    notifyCustomer: false,
                    emailNotifiedAt: undefined
                },
                activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(orderToCancel.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('cancelled', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Hệ thống'} đã hủy đơn hàng. Lý do: ${cancellationReason}${refundAmount > 0 ? `. Hoàn tiền: ${refundAmount.toLocaleString('vi-VN')}đ` : ''}`))
            };
            // ✅ Remove debt transaction from customer
            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().removeDebtTransaction(orderToCancel.customerSystemId, orderToCancel.id);
            return {
                data: state.data.map((o)=>o.systemId === systemId ? updatedOrder : o)
            };
        });
    },
    addPayment: (orderSystemId, paymentData, employeeId)=>{
        // --- Side effects must happen outside setState ---
        const order = baseStore.getState().findById(orderSystemId);
        const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
        if (!order || !employee) {
            console.error("Order or employee not found for payment.");
            return;
        }
        const { document: createdReceipt, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createReceiptDocument"])({
            amount: paymentData.amount,
            description: `Thanh toán cho đơn hàng ${order.id}`,
            customerName: order.customerName,
            customerSystemId: order.customerSystemId,
            branchSystemId: order.branchSystemId,
            branchName: order.branchName,
            createdBy: employeeId,
            paymentMethodName: paymentData.method,
            receiptTypeName: 'Thanh toán cho đơn hàng',
            originalDocumentId: order.id,
            linkedOrderSystemId: order.systemId,
            affectsDebt: true
        });
        if (!createdReceipt) {
            console.error('Failed to create receipt', error);
            alert('Không thể tạo phiếu thu cho đơn hàng. Vui lòng kiểm tra cấu hình chứng từ.');
            return;
        }
        // 2. Now, update the order state with the created receipt info
        baseStore.setState((state)=>{
            const orderIndex = state.data.findIndex((o)=>o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
            const orderToUpdate = state.data[orderIndex];
            const newPayment = {
                systemId: createdReceipt.systemId,
                id: createdReceipt.id,
                date: createdReceipt.date,
                amount: createdReceipt.amount,
                method: createdReceipt.paymentMethodName,
                createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(createdReceipt.createdBy),
                description: createdReceipt.description
            };
            const updatedOrder = applyPaymentToOrder(orderToUpdate, newPayment);
            // ✅ Add activity history entry
            updatedOrder.activityHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(orderToUpdate.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('payment_made', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Nhân viên'} đã thanh toán ${paymentData.amount.toLocaleString('vi-VN')}đ bằng ${paymentData.method}`));
            const newData = [
                ...state.data
            ];
            newData[orderIndex] = updatedOrder;
            return {
                data: newData
            };
        });
    },
    requestPackaging: (orderSystemId, employeeId, assignedEmployeeId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const assignedEmployee = assignedEmployeeId ? __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(assignedEmployeeId) : null;
            // Count only active packagings for proper numbering
            const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
            const activeCountAfterInsert = activePackagings.length + 1;
            const newActiveIndex = activePackagings.length; // This will be the index in active packagings
            const newPackaging = {
                systemId: getNextPackagingSystemId(),
                id: buildPackagingBusinessId(order.id, newActiveIndex, activeCountAfterInsert),
                requestDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                requestingEmployeeId: employeeId,
                requestingEmployeeName: employee?.fullName || 'N/A',
                assignedEmployeeId,
                assignedEmployeeName: assignedEmployee?.fullName,
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in'
            };
            const updatedOrder = {
                ...order,
                packagings: [
                    ...order.packagings,
                    newPackaging
                ],
                deliveryStatus: 'Chờ đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmPackaging: (orderSystemId, packagingSystemId, employeeId)=>{
        // ✅ Check negative packing setting
        const { allowNegativePacking } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativePacking) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể đóng gói: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể đóng gói: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const dataCopy = [
                ...state.data
            ];
            const orderIndex = dataCopy.findIndex((o)=>o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
            const orderCopy = {
                ...dataCopy[orderIndex]
            };
            const packagingIndex = orderCopy.packagings.findIndex((p)=>p.systemId === packagingSystemId);
            if (packagingIndex === -1) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const packagingsCopy = [
                ...orderCopy.packagings
            ];
            packagingsCopy[packagingIndex] = {
                ...packagingsCopy[packagingIndex],
                status: 'Đã đóng gói',
                confirmDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                confirmingEmployeeId: employeeId,
                confirmingEmployeeName: employee?.fullName || 'N/A'
            };
            orderCopy.packagings = packagingsCopy;
            orderCopy.deliveryStatus = 'Đã đóng gói';
            dataCopy[orderIndex] = orderCopy;
            return {
                data: dataCopy
            };
        });
    },
    cancelPackagingRequest: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>{
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        status: 'Hủy đóng gói',
                        cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        cancelingEmployeeId: employeeId,
                        cancelingEmployeeName: employee?.fullName || 'N/A',
                        cancelReason: reason
                    };
                }
                return p;
            });
            const isAnyActivePackaging = updatedPackagings.some((p)=>p.status !== 'Hủy đóng gói');
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: isAnyActivePackaging ? order.deliveryStatus : 'Chờ đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    processInStorePickup: (orderSystemId, packagingSystemId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const totalCount = order.packagings.length;
            const updatedPackagings = order.packagings.map((p, index)=>{
                if (p.systemId === packagingSystemId) {
                    const hasId = typeof p.id === 'string' && p.id.trim().length > 0;
                    const resolvedId = hasId ? p.id : buildPackagingBusinessId(order.id, index, totalCount);
                    return {
                        ...p,
                        id: resolvedId,
                        deliveryMethod: 'Nhận tại cửa hàng',
                        deliveryStatus: 'Đã đóng gói'
                    };
                }
                return p;
            });
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmInStorePickup: (orderSystemId, packagingSystemId, employeeId)=>{
        console.log('🟢 [confirmInStorePickup] Called with:', {
            orderSystemId,
            packagingSystemId,
            employeeId
        });
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) {
                console.error('❌ [confirmInStorePickup] Order not found:', orderSystemId);
                return state;
            }
            console.log('📋 [confirmInStorePickup] Order found:', order.id);
            console.log('📋 [confirmInStorePickup] Line items:', order.lineItems.length);
            // Stock logic
            const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            order.lineItems.forEach((item, index)=>{
                console.log(`📦 [confirmInStorePickup] Dispatching item ${index + 1}:`, {
                    productSystemId: item.productSystemId,
                    productName: item.productName,
                    quantity: item.quantity,
                    branchSystemId: getBranchId(order)
                });
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                // ✅ Add stock history entry for each processed item (SP con nếu combo)
                processedItems.forEach((processedItem)=>{
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống'
                    });
                });
            });
            // Status update logic - will be updated with trackingCode after shipment creation
            let updatedPackagings = order.packagings.map((p)=>{
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        deliveryStatus: 'Đã giao hàng',
                        deliveredDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                    };
                }
                return p;
            });
            const isAllDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status;
            let newCompletedDate = order.completedDate;
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            // ✅ Create shipment record for INSTORE pickup
            const packaging = order.packagings.find((p)=>p.systemId === packagingSystemId);
            let newShipment = null;
            if (packaging) {
                const { createShipment, updateShipment } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShipmentStore"].getState();
                newShipment = createShipment({
                    packagingSystemId: packagingSystemId,
                    orderSystemId: orderSystemId,
                    orderId: order.id,
                    trackingCode: '',
                    carrier: 'Nhận tại cửa hàng',
                    service: 'Nhận tại cửa hàng',
                    deliveryStatus: 'Đã giao hàng',
                    printStatus: 'Chưa in',
                    reconciliationStatus: 'Chưa đối soát',
                    shippingFeeToPartner: 0,
                    codAmount: 0,
                    payer: 'Người gửi',
                    createdAt: now,
                    dispatchedAt: now,
                    deliveredAt: now
                });
                // Update shipment trackingCode to use its own business ID
                if (newShipment) {
                    updateShipment(newShipment.systemId, {
                        trackingCode: newShipment.id
                    });
                    // Update packaging with shipment trackingCode
                    updatedPackagings = updatedPackagings.map((p)=>{
                        if (p.systemId === packagingSystemId) {
                            return {
                                ...p,
                                trackingCode: newShipment.id
                            };
                        }
                        return p;
                    });
                }
                console.log('✅ [confirmInStorePickup] Shipment created:', newShipment?.id);
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã giao hàng',
                status: newStatus,
                completedDate: newCompletedDate,
                stockOutStatus: 'Xuất kho toàn bộ',
                dispatchedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employee?.fullName
            };
            console.log('✅ [confirmInStorePickup] Stock dispatched successfully');
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmPartnerShipment: async (orderSystemId, packagingSystemId, _shipmentData)=>{
        try {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (!order) {
                return {
                    success: false,
                    message: 'Không tìm thấy đơn hàng'
                };
            }
            // ✅ Check negative packing setting (covers creating shipment)
            const { allowNegativePacking } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
            if (!allowNegativePacking) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                return {
                                    success: false,
                                    message: `Không thể tạo vận đơn: Sản phẩm "${childProduct?.name}" không đủ tồn kho`
                                };
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            return {
                                success: false,
                                message: `Không thể tạo vận đơn: Sản phẩm "${item.productName}" không đủ tồn kho`
                            };
                        }
                    }
                }
            }
            // ✅ Get GHTK preview params from window (set by ShippingIntegration)
            const ghtkParams = window.__ghtkPreviewParams;
            if (!ghtkParams) {
                return {
                    success: false,
                    message: 'Thiếu thông tin vận chuyển. Vui lòng chọn dịch vụ vận chuyển.'
                };
            }
            // ✅ Import GHTK service dynamically
            const { GHTKService } = await __turbopack_context__.A("[project]/features/settings/shipping/integrations/ghtk-service.ts [app-ssr] (ecmascript, async loader)");
            const { getGHTKCredentials } = await __turbopack_context__.A("[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript, async loader)");
            const { apiToken, partnerCode } = getGHTKCredentials();
            const ghtkService = new GHTKService(apiToken, partnerCode);
            console.log('📤 [confirmPartnerShipment] Calling GHTK API with params:', ghtkParams);
            // ✅ Call real GHTK API
            const result = await ghtkService.createOrder(ghtkParams);
            if (!result.success || !result.order) {
                throw new Error(result.message || 'Không thể tạo đơn vận chuyển');
            }
            // ✅ Update order with real tracking code from GHTK
            const trackingCode = result.order.label;
            const ghtkTrackingId = result.order.tracking_id;
            const estimatedPickTime = result.order.estimated_pick_time;
            const estimatedDeliverTime = result.order.estimated_deliver_time;
            baseStore.setState((state)=>{
                const updatedPackagings = order.packagings.map((p)=>{
                    if (p.systemId === packagingSystemId) {
                        return {
                            ...p,
                            deliveryMethod: 'Dịch vụ giao hàng',
                            deliveryStatus: 'Chờ lấy hàng',
                            carrier: 'GHTK',
                            service: result.order?.fee ? `${result.order.fee}đ` : 'Standard',
                            trackingCode: trackingCode,
                            shippingFeeToPartner: parseInt(result.order?.fee || '0') || 0,
                            codAmount: ghtkParams.pickMoney || 0,
                            payer: ghtkParams.isFreeship === 1 ? 'Người gửi' : 'Người nhận',
                            noteToShipper: ghtkParams.note || '',
                            weight: ghtkParams.totalWeight || 0,
                            dimensions: `${ghtkParams.products?.[0]?.length || 10}×${ghtkParams.products?.[0]?.width || 10}×${ghtkParams.products?.[0]?.height || 10}`,
                            // ✅ Store GHTK specific data
                            ghtkTrackingId: String(ghtkTrackingId),
                            estimatedPickTime: estimatedPickTime,
                            estimatedDeliverTime: estimatedDeliverTime
                        };
                    }
                    return p;
                });
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings,
                    deliveryStatus: 'Chờ lấy hàng',
                    status: 'Đang giao dịch'
                };
                return {
                    data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            console.log('✅ [confirmPartnerShipment] GHTK order created successfully:', {
                trackingCode,
                ghtkTrackingId,
                estimatedPickTime,
                estimatedDeliverTime
            });
            return {
                success: true,
                message: `Tạo vận đơn thành công! Mã vận đơn: ${trackingCode}`
            };
        } catch (error) {
            console.error('❌ [confirmPartnerShipment] Error:', error);
            let errorMessage = 'Vui lòng thử lại';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return {
                success: false,
                message: `Lỗi tạo đơn vận chuyển: ${errorMessage}`
            };
        }
    },
    dispatchFromWarehouse: (orderSystemId, packagingSystemId, employeeId)=>{
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            order.lineItems.forEach((item)=>{
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                // ✅ Add stock history entry for each processed item
                processedItems.forEach((processedItem)=>{
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống'
                    });
                });
            });
            const now2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Đang giao hàng'
                } : p);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đang giao hàng',
                stockOutStatus: 'Xuất kho toàn bộ',
                dispatchedDate: now2,
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employeeData?.fullName,
                status: order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    completeDelivery: (orderSystemId, packagingSystemId, employeeId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ Complete delivery (hỗ trợ combo - sẽ complete SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'complete', item.quantity);
            });
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Đã giao hàng',
                    deliveredDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                } : p);
            const isAllDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status;
            let newCompletedDate = order.completedDate;
            // ✅ Khi tất cả đơn đã giao → tạo công nợ (nếu có) và cập nhật stats
            if (isAllDelivered && order.status !== 'Hoàn thành') {
                // Tính công nợ còn lại
                const totalPaid = (order.payments || []).reduce((sum, p)=>sum + p.amount, 0);
                const debtAmount = Math.max(0, order.grandTotal - totalPaid);
                // ✅ Tạo công nợ CHỈ KHI giao hàng thành công
                if (debtAmount > 0) {
                    const { addDebtTransaction } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + 30);
                    addDebtTransaction(order.customerSystemId, {
                        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`DEBT_${order.systemId}`),
                        orderId: order.id,
                        orderDate: order.orderDate.split('T')[0],
                        amount: debtAmount,
                        dueDate: dueDate.toISOString().split('T')[0],
                        isPaid: false,
                        remainingAmount: debtAmount,
                        notes: 'Công nợ từ đơn hàng đã giao thành công'
                    });
                }
                // Update customer stats
                const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                incrementOrderStats(order.customerSystemId, order.grandTotal);
            }
            // Check if order is fully complete (delivered + fully paid)
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã giao hàng',
                status: newStatus,
                completedDate: newCompletedDate,
                activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(order.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Nhân viên'} đã xác nhận giao hàng thành công${newStatus === 'Hoàn thành' ? '. Đơn hàng hoàn thành' : ''}`))
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    failDelivery: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const { incrementFailedDeliveryStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
            // ✅ Return stock from transit (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });
            // ✅ Update customer failed delivery stats
            incrementFailedDeliveryStats(order.customerSystemId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Chờ giao lại',
                    notes: `Giao thất bại: ${reason}`
                } : p);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Chờ giao lại'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    cancelDeliveryOnly: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ Get employee info for canceller
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelReason: `Hủy giao hàng: ${reason}`,
                    cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống'
                } : p);
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every((p)=>p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch';
                newDeliveryStatus = 'Chưa giao hàng';
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    // ✅ Hủy giao và nhận lại hàng - TRẢ hàng về kho (đã nhận lại từ shipper)
    cancelDelivery: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ TRẢ hàng từ "đang giao" về "tồn kho" (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });
            // ✅ Get employee info for canceller
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelReason: `Hủy giao hàng: ${reason}`,
                    cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống'
                } : p);
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every((p)=>p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch';
                newDeliveryStatus = 'Chưa giao hàng';
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmCodReconciliation: (shipments, employeeId)=>{
        const { add: addReceipt } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
        const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
        const { data: receiptTypes } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState();
        const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
        const allOrders = baseStore.getState().data;
        const totalByPartnerAndBranch = {};
        shipments.forEach((shipment)=>{
            const order = allOrders.find((o)=>o.systemId === shipment.orderSystemId);
            if (!order || !shipment.carrier) return;
            const key = `${shipment.carrier}-${getBranchId(order)}`;
            if (!totalByPartnerAndBranch[key]) {
                totalByPartnerAndBranch[key] = {
                    total: 0,
                    ids: [],
                    branchSystemId: getBranchId(order),
                    branchName: order.branchName,
                    partnerName: shipment.carrier,
                    shipmentSystemIds: []
                };
            }
            totalByPartnerAndBranch[key].total += shipment.codAmount || 0;
            totalByPartnerAndBranch[key].ids.push(shipment.trackingCode || shipment.id);
            totalByPartnerAndBranch[key].shipmentSystemIds.push(shipment.systemId);
        });
        const createdReceipts = [];
        Object.values(totalByPartnerAndBranch).forEach((group)=>{
            const account = accounts.find((acc)=>acc.type === 'bank' && acc.branchSystemId === group.branchSystemId) || accounts.find((acc)=>acc.type === 'bank');
            const category = receiptTypes.find((c)=>c.id === 'DOISOATCOD');
            if (account && category) {
                const newReceiptData = {
                    id: '',
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    amount: group.total,
                    payerType: 'Đối tác vận chuyển',
                    payerName: group.partnerName,
                    description: `Đối soát COD cho các vận đơn: ${group.ids.join(', ')}`,
                    paymentMethod: 'Chuyển khoản',
                    accountSystemId: account.systemId,
                    originalDocumentId: group.ids.join(', '),
                    createdBy: employee?.fullName || 'N/A',
                    branchSystemId: group.branchSystemId,
                    branchName: group.branchName,
                    paymentReceiptTypeSystemId: category.systemId,
                    paymentReceiptTypeName: category.name,
                    status: 'completed',
                    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    affectsDebt: false
                };
                const newReceipt = addReceipt(newReceiptData);
                if (newReceipt) {
                    createdReceipts.push({
                        ...newReceipt,
                        shipmentSystemIds: group.shipmentSystemIds
                    });
                }
            }
        });
        baseStore.setState((state)=>{
            const updates = new Map();
            shipments.forEach((shipment)=>{
                const receiptForShipment = createdReceipts.find((v)=>v.shipmentSystemIds.includes(shipment.systemId));
                if (!receiptForShipment || !shipment.codAmount || shipment.codAmount <= 0) return;
                const orderSystemId = shipment.orderSystemId;
                const orderUpdates = updates.get(orderSystemId) || {
                    newPayments: [],
                    reconciledShipmentIds: []
                };
                const newPayment = {
                    systemId: receiptForShipment.systemId,
                    id: receiptForShipment.id,
                    date: receiptForShipment.date,
                    method: 'Đối soát COD',
                    amount: shipment.codAmount || 0,
                    createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM'),
                    description: `Thanh toán COD cho vận đơn ${shipment.trackingCode || shipment.id}`
                };
                orderUpdates.newPayments.push(newPayment);
                orderUpdates.reconciledShipmentIds.push(shipment.systemId);
                updates.set(orderSystemId, orderUpdates);
            });
            if (updates.size === 0) return state;
            const newData = state.data.map((order)=>{
                if (updates.has(order.systemId)) {
                    const orderUpdates = updates.get(order.systemId);
                    let updatedOrder = {
                        ...order
                    };
                    updatedOrder.packagings = updatedOrder.packagings.map((p)=>orderUpdates.reconciledShipmentIds.includes(p.systemId) ? {
                            ...p,
                            reconciliationStatus: 'Đã đối soát'
                        } : p);
                    for (const payment of orderUpdates.newPayments){
                        updatedOrder = applyPaymentToOrder(updatedOrder, payment);
                    }
                    return updatedOrder;
                }
                return order;
            });
            return {
                data: newData
            };
        });
    },
    // ============================================
    // GHTK INTEGRATION METHODS
    // ============================================
    /**
     * Process GHTK webhook update
     * Called when GHTK pushes status update or from tracking API
     */ processGHTKWebhook: (webhookData)=>{
        baseStore.setState((state)=>{
            // Find order by tracking code or partner_id
            const order = state.data.find((o)=>o.packagings.some((p)=>p.trackingCode === webhookData.label_id || p.systemId === webhookData.partner_id || o.systemId === webhookData.partner_id));
            if (!order) {
                console.warn('[GHTK Webhook] Order not found for:', {
                    label_id: webhookData.label_id,
                    partner_id: webhookData.partner_id
                });
                return state;
            }
            // Import status mapping
            const { getGHTKStatusInfo, getGHTKReasonText } = __turbopack_context__.r("[project]/lib/ghtk-constants.ts [app-ssr] (ecmascript)");
            const statusMapping = getGHTKStatusInfo(webhookData.status_id);
            if (!statusMapping) {
                console.warn('[GHTK Webhook] Unknown status:', webhookData.status_id);
                return state;
            }
            console.log('[GHTK Webhook] Processing update:', {
                order: order.id,
                trackingCode: webhookData.label_id,
                statusId: webhookData.status_id,
                statusText: statusMapping.statusText,
                deliveryStatus: statusMapping.deliveryStatus
            });
            // Update packaging with new status
            const updatedPackagings = order.packagings.map((p)=>{
                if (p.trackingCode !== webhookData.label_id && p.systemId !== webhookData.partner_id) {
                    return p;
                }
                return {
                    ...p,
                    deliveryStatus: statusMapping.deliveryStatus,
                    partnerStatus: statusMapping.statusText,
                    ghtkStatusId: webhookData.status_id,
                    ghtkReasonCode: webhookData.reason_code,
                    ghtkReasonText: webhookData.reason ? webhookData.reason : webhookData.reason_code ? getGHTKReasonText(webhookData.reason_code) : undefined,
                    actualWeight: webhookData.weight,
                    actualFee: webhookData.fee,
                    lastSyncedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    // Update reconciliation status if status = 6 (Đã đối soát)
                    reconciliationStatus: webhookData.status_id === 6 ? 'Đã đối soát' : p.reconciliationStatus,
                    // Update delivered date if status = 5 or 6
                    deliveredDate: [
                        5,
                        6
                    ].includes(webhookData.status_id) && !p.deliveredDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()) : p.deliveredDate
                };
            });
            // Handle stock updates based on status
            if (statusMapping.shouldUpdateStock && statusMapping.stockAction) {
                const { dispatchStock, completeDelivery: productCompleteDelivery, returnStockFromTransit } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                const { incrementFailedDeliveryStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                // ✅ Expand combo items to child products
                const stockItems = getComboStockItems(order.lineItems);
                stockItems.forEach((item)=>{
                    switch(statusMapping.stockAction){
                        case 'dispatch':
                            // Status 3: Đã lấy hàng -> Move to transit
                            dispatchStock(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                        case 'complete':
                            // Status 5: Đã giao hàng -> Complete delivery
                            productCompleteDelivery(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                        case 'return':
                            // Status -1, 7, 9, 13, 20: Failed/Returned -> Return stock
                            returnStockFromTransit(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                    }
                });
                // ✅ Increment failed delivery stats for customer if return (moved outside loop)
                if (statusMapping.stockAction === 'return') {
                    const failureStatuses = [
                        7,
                        9,
                        13,
                        20,
                        21
                    ];
                    const currentPackaging = order.packagings.find((p)=>p.trackingCode === webhookData.label_id);
                    const previousStatusId = currentPackaging?.ghtkStatusId;
                    if (failureStatuses.includes(webhookData.status_id) && (!previousStatusId || !failureStatuses.includes(previousStatusId))) {
                        incrementFailedDeliveryStats(order.customerSystemId);
                    }
                }
                console.log('[GHTK Webhook] Stock updated:', {
                    action: statusMapping.stockAction,
                    items: stockItems.length
                });
            }
            // Determine order-level delivery status
            const allPackagingsDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newOrderDeliveryStatus = order.deliveryStatus;
            let newOrderStatus = order.status;
            let newCompletedDate = order.completedDate;
            let newStockOutStatus = order.stockOutStatus;
            // Update order delivery status
            if (allPackagingsDelivered) {
                newOrderDeliveryStatus = 'Đã giao hàng';
                // Auto-complete order if delivered + paid
                if (order.paymentStatus === 'Thanh toán toàn bộ' && order.status !== 'Hoàn thành') {
                    newOrderStatus = 'Hoàn thành';
                    newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
                    // Update customer stats
                    const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                    incrementOrderStats(order.customerSystemId, order.grandTotal);
                    console.log('[GHTK Webhook] Order completed:', order.id);
                }
            } else if (statusMapping.statusId === 3) {
                // Status 3: Đã lấy hàng
                newOrderDeliveryStatus = 'Đang giao hàng';
                newStockOutStatus = 'Xuất kho toàn bộ';
            } else if ([
                4,
                10
            ].includes(statusMapping.statusId)) {
                // Status 4, 10: Đang giao
                newOrderDeliveryStatus = 'Đang giao hàng';
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: newOrderDeliveryStatus,
                status: newOrderStatus,
                completedDate: newCompletedDate,
                stockOutStatus: newStockOutStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === order.systemId ? updatedOrder : o)
            };
        });
    },
    /**
     * Cancel GHTK shipment
     * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
     */ cancelGHTKShipment: async (orderSystemId, packagingSystemId, trackingCode)=>{
        try {
            console.log('[GHTK] Cancelling shipment:', trackingCode);
            // ✅ Lấy credentials từ shipping_partners_config
            const { getGHTKCredentials } = await __turbopack_context__.A("[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript, async loader)");
            let credentials;
            try {
                credentials = getGHTKCredentials();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.';
                return {
                    success: false,
                    message: errorMessage
                };
            }
            const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])('/shipping/ghtk/cancel-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trackingCode,
                    apiToken: credentials.apiToken,
                    partnerCode: credentials.partnerCode
                })
            });
            const data = await response.json();
            // ✅ Kiểm tra response từ GHTK
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to cancel GHTK shipment');
            }
            // ✅ GHTK trả success: false khi không thể hủy (đã lấy hàng)
            if (data.success === false) {
                console.log('[GHTK] Cannot cancel:', data.message);
                return {
                    success: false,
                    message: data.message || 'Không thể hủy đơn hàng'
                };
            }
            console.log('[GHTK] Cancellation successful:', data.message);
            // ✅ CHỈ update state khi GHTK xác nhận hủy thành công
            baseStore.setState((state)=>{
                const order = state.data.find((o)=>o.systemId === orderSystemId);
                if (!order) return state;
                const updatedPackagings = order.packagings.map((p)=>{
                    if (p.systemId !== packagingSystemId) return p;
                    return {
                        ...p,
                        status: 'Hủy đóng gói',
                        deliveryStatus: 'Đã hủy',
                        cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        cancelReason: 'Hủy vận đơn GHTK',
                        ghtkStatusId: -1,
                        partnerStatus: 'Hủy đơn hàng'
                    };
                });
                // ✅ KHÔNG rollback stock - để user tự quyết định (nút "Hủy giao và nhận lại hàng")
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings
                };
                return {
                    data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            return {
                success: true,
                message: data.message || 'Đã hủy vận đơn GHTK thành công'
            };
        } catch (error) {
            console.error('[GHTK] Cancel error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi khi hủy vận đơn GHTK';
            return {
                success: false,
                message: errorMessage
            };
        }
    }
};
// Auto-allocate historical receipts on startup
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().data.forEach((receipt)=>{
    autoAllocateReceiptToOrders(receipt);
});
// React to newly created receipts
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].subscribe((state)=>state.data, (currentReceipts, previousReceipts)=>{
    const previousIds = new Set((previousReceipts ?? []).map((r)=>r.systemId));
    currentReceipts.forEach((receipt)=>{
        if (!previousIds.has(receipt.systemId)) {
            autoAllocateReceiptToOrders(receipt);
        }
    });
});
const useOrderStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
useOrderStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
"[project]/features/orders/api/order-actions-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Orders API - Additional functions for cancel, payment, etc.
 */ __turbopack_context__.s([
    "addOrderPayment",
    ()=>addOrderPayment,
    "cancelDelivery",
    ()=>cancelDelivery,
    "cancelGHTKShipment",
    ()=>cancelGHTKShipment,
    "cancelOrder",
    ()=>cancelOrder,
    "cancelPackagingRequest",
    ()=>cancelPackagingRequest,
    "cancelShipment",
    ()=>cancelShipment,
    "completeDelivery",
    ()=>completeDelivery,
    "confirmCodReconciliation",
    ()=>confirmCodReconciliation,
    "confirmInStorePickup",
    ()=>confirmInStorePickup,
    "confirmPackaging",
    ()=>confirmPackaging,
    "createGHTKShipment",
    ()=>createGHTKShipment,
    "createPackaging",
    ()=>createPackaging,
    "createShipment",
    ()=>createShipment,
    "dispatchFromWarehouse",
    ()=>dispatchFromWarehouse,
    "failDelivery",
    ()=>failDelivery,
    "processInStorePickup",
    ()=>processInStorePickup,
    "syncGHTKShipment",
    ()=>syncGHTKShipment,
    "syncShipmentStatus",
    ()=>syncShipmentStatus,
    "updateOrderStatus",
    ()=>updateOrderStatus
]);
const API_BASE = '/api/orders';
async function cancelOrder(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel order');
    }
    return res.json();
}
async function addOrderPayment(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to add payment');
    }
    return res.json();
}
async function updateOrderStatus(systemId, status) {
    const res = await fetch(`${API_BASE}/${systemId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status
        })
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update status');
    }
    return res.json();
}
async function createPackaging(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create packaging');
    }
    return res.json();
}
async function confirmPackaging(systemId, packagingId) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/confirm`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to confirm packaging');
    }
    return res.json();
}
async function createShipment(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/shipment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create shipment');
    }
    return res.json();
}
async function syncShipmentStatus(systemId) {
    const res = await fetch(`${API_BASE}/${systemId}/shipment/sync`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to sync shipment');
    }
    return res.json();
}
async function cancelShipment(systemId) {
    const res = await fetch(`${API_BASE}/${systemId}/shipment/cancel`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel shipment');
    }
    return res.json();
}
async function cancelPackagingRequest(systemId, packagingId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel packaging');
    }
    return res.json();
}
async function processInStorePickup(systemId, packagingId) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/in-store-pickup`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to process in-store pickup');
    }
    return res.json();
}
async function confirmInStorePickup(systemId, packagingId) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/in-store-pickup/confirm`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to confirm in-store pickup');
    }
    return res.json();
}
async function dispatchFromWarehouse(systemId, packagingId) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/dispatch`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to dispatch from warehouse');
    }
    return res.json();
}
async function completeDelivery(systemId, packagingId) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/complete-delivery`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to complete delivery');
    }
    return res.json();
}
async function failDelivery(systemId, packagingId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/fail-delivery`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to mark delivery as failed');
    }
    return res.json();
}
async function cancelDelivery(systemId, packagingId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/cancel-delivery`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel delivery');
    }
    return res.json();
}
async function confirmCodReconciliation(data) {
    const res = await fetch(`${API_BASE}/reconciliation/cod`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to confirm COD reconciliation');
    }
    return res.json();
}
async function createGHTKShipment(systemId, packagingId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/ghtk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create GHTK shipment');
    }
    return res.json();
}
async function cancelGHTKShipment(systemId, packagingId, trackingCode) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/ghtk/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            trackingCode
        })
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel GHTK shipment');
    }
    return res.json();
}
async function syncGHTKShipment(systemId, packagingId) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/ghtk/sync`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to sync GHTK shipment');
    }
    return res.json();
}
}),
"[project]/features/orders/api/orders-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Orders API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */ __turbopack_context__.s([
    "createOrder",
    ()=>createOrder,
    "deleteOrder",
    ()=>deleteOrder,
    "fetchOrder",
    ()=>fetchOrder,
    "fetchOrderStats",
    ()=>fetchOrderStats,
    "fetchOrders",
    ()=>fetchOrders,
    "updateOrder",
    ()=>updateOrder
]);
const API_BASE = '/api/orders';
async function fetchOrders(params = {}) {
    const { page = 1, limit = 50, ...rest } = params;
    const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    // Add optional params
    Object.entries(rest).forEach(([key, value])=>{
        if (value != null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    const res = await fetch(`${API_BASE}?${searchParams}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }
    return res.json();
}
async function fetchOrder(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch order ${id}: ${res.statusText}`);
    }
    return res.json();
}
async function createOrder(data) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to create order: ${res.statusText}`);
    }
    return res.json();
}
async function updateOrder({ id, ...data }) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to update order: ${res.statusText}`);
    }
    return res.json();
}
async function deleteOrder(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to delete order: ${res.statusText}`);
    }
}
async function fetchOrderStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) {
        throw new Error(`Failed to fetch order stats: ${res.statusText}`);
    }
    return res.json();
}
}),
"[project]/features/orders/hooks/use-orders.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "orderKeys",
    ()=>orderKeys,
    "useOrder",
    ()=>useOrder,
    "useOrderSearch",
    ()=>useOrderSearch,
    "useOrderStats",
    ()=>useOrderStats,
    "useOrders",
    ()=>useOrders
]);
/**
 * useOrders - React Query hook for orders list
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useOrders } from '@/features/orders/hooks/use-orders'
 * - NEVER import from '@/features/orders' or '@/features/orders/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/api/orders-api.ts [app-ssr] (ecmascript)");
// Re-export from use-all-orders for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-all-orders.ts [app-ssr] (ecmascript) <locals>");
;
;
const orderKeys = {
    all: [
        'orders'
    ],
    lists: ()=>[
            ...orderKeys.all,
            'list'
        ],
    list: (params)=>[
            ...orderKeys.lists(),
            params
        ],
    details: ()=>[
            ...orderKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...orderKeys.details(),
            id
        ],
    stats: ()=>[
            ...orderKeys.all,
            'stats'
        ]
};
function useOrders(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrders"])(params),
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useOrder(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrder"])(id),
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
function useOrderStats() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrderStats"],
        staleTime: 60_000,
        gcTime: 5 * 60 * 1000
    });
}
function useOrderSearch(search, limit = 20) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.list({
            search,
            limit
        }),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrders"])({
                search,
                limit
            }),
        enabled: search.length >= 2,
        staleTime: 30_000
    });
}
;
}),
"[project]/features/orders/hooks/use-order-actions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrderActions",
    ()=>useOrderActions
]);
/**
 * useOrderActions - Mutations for order actions (cancel, payment, packaging, shipment)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/api/order-actions-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-orders.ts [app-ssr] (ecmascript) <locals>");
;
;
;
function useOrderActions(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>queryClient.invalidateQueries({
            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].all
        });
    // ============================================
    // ORDER LIFECYCLE
    // ============================================
    const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, reason, restockItems })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelOrder"])(systemId, {
                reason,
                restockItems
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const addPayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, ...data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addOrderPayment"])(systemId, data),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const updateStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, status })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateOrderStatus"])(systemId, status),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    // ============================================
    // PACKAGING
    // ============================================
    const requestPackaging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, assignedEmployeeId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPackaging"])(systemId, {
                assignedEmployeeId
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const confirmPacking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["confirmPackaging"])(systemId, packagingId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const cancelPacking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId, reason })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelPackagingRequest"])(systemId, packagingId, {
                reason
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    // ============================================
    // DELIVERY - IN-STORE PICKUP
    // ============================================
    const selectInStorePickup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInStorePickup"])(systemId, packagingId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const confirmPickup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["confirmInStorePickup"])(systemId, packagingId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    // ============================================
    // DELIVERY - WAREHOUSE DISPATCH
    // ============================================
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dispatchFromWarehouse"])(systemId, packagingId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const complete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["completeDelivery"])(systemId, packagingId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const fail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId, reason })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["failDelivery"])(systemId, packagingId, {
                reason
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const cancelDeliveryMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId, reason, restockItems })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelDelivery"])(systemId, packagingId, {
                reason,
                restockItems
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    // ============================================
    // SHIPMENT (Generic)
    // ============================================
    const requestShipment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, provider, serviceType })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createShipment"])(systemId, {
                provider,
                serviceType
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const syncShipment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncShipmentStatus"])(systemId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const cancelOrderShipment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelShipment"])(systemId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    // ============================================
    // COD RECONCILIATION
    // ============================================
    const reconcileCod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["confirmCodReconciliation"])(data),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    // ============================================
    // GHTK INTEGRATION
    // ============================================
    const createGhtk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createGHTKShipment"])(systemId, packagingId, data),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const cancelGhtk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId, trackingCode })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelGHTKShipment"])(systemId, packagingId, trackingCode),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const syncGhtk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncGHTKShipment"])(systemId, packagingId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        // Order lifecycle
        cancel,
        addPayment,
        updateStatus,
        // Packaging
        requestPackaging,
        confirmPacking,
        cancelPacking,
        // Delivery - In-store
        selectInStorePickup,
        confirmPickup,
        // Delivery - Warehouse/Courier
        dispatch,
        complete,
        fail,
        cancelDelivery: cancelDeliveryMutation,
        // Shipment
        requestShipment,
        syncShipment,
        cancelOrderShipment,
        // COD
        reconcileCod,
        // GHTK
        createGhtk,
        cancelGhtk,
        syncGhtk,
        // Loading states
        isLoading: cancel.isPending || addPayment.isPending || updateStatus.isPending || requestPackaging.isPending || confirmPacking.isPending || cancelPacking.isPending || selectInStorePickup.isPending || confirmPickup.isPending || dispatch.isPending || complete.isPending || fail.isPending || cancelDeliveryMutation.isPending || requestShipment.isPending || syncShipment.isPending || cancelOrderShipment.isPending || reconcileCod.isPending || createGhtk.isPending || cancelGhtk.isPending || syncGhtk.isPending
    };
}
}),
"[project]/features/orders/hooks/use-all-orders.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActiveOrders",
    ()=>useActiveOrders,
    "useAllOrders",
    ()=>useAllOrders,
    "useOrderFinder",
    ()=>useOrderFinder
]);
/**
 * useAllOrders - Convenience hook for components needing all orders as flat array
 * 
 * ⚠️ WARNING: This loads ALL orders into memory. Use with caution for large datasets.
 * Consider using useOrders with pagination for better performance.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-ssr] (ecmascript)");
/**
 * Hook for accessing order store actions (add, update, delete, etc.)
 * Replaces legacy useOrderStore() action usage
 * Re-exports from use-order-actions for convenience
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$order$2d$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-order-actions.ts [app-ssr] (ecmascript)");
;
;
function useAllOrders() {
    const { data } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"])();
    return {
        data: data || [],
        isLoading: false,
        isError: false,
        error: null
    };
}
function useActiveOrders() {
    const { data, isLoading, isError, error } = useAllOrders();
    const activeOrders = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>data.filter((o)=>o.status !== 'Đã hủy'), [
        data
    ]);
    return {
        data: activeOrders,
        isLoading,
        isError,
        error
    };
}
;
function useOrderFinder() {
    const { data } = useAllOrders();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((o)=>o.systemId === systemId);
    }, [
        data
    ]);
    const findByBusinessId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((businessId)=>{
        if (!businessId) return undefined;
        return data.find((o)=>o.id === businessId);
    }, [
        data
    ]);
    return {
        findById,
        findByBusinessId
    };
}
}),
"[project]/features/customers/hooks/use-computed-debt.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllCustomersComputedDebt",
    ()=>useAllCustomersComputedDebt,
    "useComputedCustomerDebt",
    ()=>useComputedCustomerDebt,
    "useCustomersWithComputedDebt",
    ()=>useCustomersWithComputedDebt
]);
/**
 * Hook to compute customer debt dynamically from orders and receipts/payments
 * ═══════════════════════════════════════════════════════════════
 * This replaces the static currentDebt field with real-time calculated debt
 * based on:
 * - Delivered orders (increases debt)
 * - Receipts with affectsDebt=true (decreases debt)
 * - Payments with affectsDebt=true (increases/decreases debt) - excluding sales return refunds
 * 
 * NOTE: Sales returns and refund payments from sales returns do NOT affect debt.
 * They are cash transactions, not debt transactions.
 * 
 * IMPORTANT: This uses the same logic as detail-page.tsx customerDebtTransactions
 * to ensure consistency across the app.
 * ═══════════════════════════════════════════════════════════════
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-all-orders.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
;
/**
 * Compute debt transactions and current debt for a customer
 * Uses the same logic as detail-page.tsx for consistency
 */ function computeCustomerDebtTransactions(customer, allOrders, allReceipts, allPayments) {
    // Get orders that create debt for this customer
    // Debt starts when: status='Hoàn thành' OR deliveryStatus='Đã giao hàng' OR stockOutStatus='Xuất kho toàn bộ'
    const debtCreatingOrders = allOrders.filter((o)=>o.customerSystemId === customer.systemId && o.status !== 'Đã hủy' && (o.status === 'Hoàn thành' || o.deliveryStatus === 'Đã giao hàng' || o.stockOutStatus === 'Xuất kho toàn bộ'));
    // Build order transactions - use grandTotal (không trừ paidAmount)
    // vì phiếu thu đã được tính riêng ở receiptTransactions
    const orderTransactions = debtCreatingOrders.map((order)=>{
        // Calculate due date based on payment terms (default NET30)
        const orderDate = new Date(order.orderDate);
        const paymentTermDays = customer.paymentTerms === 'NET60' ? 60 : customer.paymentTerms === 'NET15' ? 15 : customer.paymentTerms === 'COD' ? 0 : 30;
        const dueDate = new Date(orderDate);
        dueDate.setDate(dueDate.getDate() + paymentTermDays);
        return {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`debt-order-${order.systemId}`),
            orderId: order.id,
            orderDate: order.orderDate,
            amount: order.grandTotal || 0,
            dueDate: dueDate.toISOString().split('T')[0],
            isPaid: false,
            remainingAmount: order.grandTotal || 0,
            notes: `Đơn hàng #${order.id}`,
            _createdAt: order.createdAt || order.orderDate,
            _type: 'order',
            _change: order.grandTotal || 0
        };
    });
    // Get receipts affecting this customer's debt
    const customerReceipts = allReceipts.filter((r)=>r.status !== 'cancelled' && r.affectsDebt === true && (r.customerSystemId === customer.systemId || r.payerSystemId === customer.systemId || r.payerTypeName === 'Khách hàng' && r.payerName === customer.name));
    const receiptTransactions = customerReceipts.map((receipt)=>({
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`debt-receipt-${receipt.systemId}`),
            orderId: receipt.id,
            orderDate: receipt.date,
            amount: receipt.amount,
            dueDate: receipt.date,
            isPaid: true,
            remainingAmount: 0,
            notes: receipt.description || `Phiếu thu #${receipt.id}`,
            _createdAt: receipt.createdAt || receipt.date,
            _type: 'receipt',
            _change: -receipt.amount
        }));
    // ✅ Phiếu chi - CHỈ TÍNH các phiếu chi KHÔNG phải hoàn tiền từ trả hàng
    // Phiếu chi hoàn tiền từ trả hàng là giao dịch tiền mặt, không ảnh hưởng công nợ
    // Phiếu trả hàng cũng KHÔNG ảnh hưởng công nợ
    const customerPayments = allPayments.filter((p)=>p.status !== 'cancelled' && p.affectsDebt === true && !p.linkedSalesReturnSystemId && // Loại bỏ phiếu chi từ trả hàng
        (p.customerSystemId === customer.systemId || p.recipientSystemId === customer.systemId || p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name));
    const paymentTransactions = customerPayments.map((payment)=>{
        // Phiếu chi cho khách (không phải trả hàng) → giảm công nợ
        const isRefundToCustomer = payment.paymentReceiptTypeName === 'Hoàn tiền khách hàng' || payment.category === 'complaint_refund';
        const changeAmount = isRefundToCustomer ? -payment.amount : payment.amount;
        return {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`debt-payment-${payment.systemId}`),
            orderId: payment.id,
            orderDate: payment.date,
            amount: payment.amount,
            dueDate: payment.date,
            isPaid: false,
            remainingAmount: payment.amount,
            notes: payment.description || `Phiếu chi #${payment.id}`,
            _createdAt: payment.createdAt || payment.date,
            _type: 'payment',
            _change: changeAmount
        };
    });
    // ✅ Công nợ = Đơn hàng - Phiếu thu - Phiếu chi (không phải trả hàng)
    // Phiếu trả hàng và phiếu chi hoàn tiền từ trả hàng KHÔNG ảnh hưởng công nợ
    const allTransactions = [
        ...orderTransactions,
        ...receiptTransactions,
        ...paymentTransactions
    ];
    allTransactions.sort((a, b)=>new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime());
    // Calculate running balance
    let runningDebt = 0;
    const _transactionsWithBalance = allTransactions.map((t)=>{
        runningDebt += t._change;
        return t;
    });
    // Get current debt (final balance)
    const currentDebt = Math.max(0, runningDebt);
    // Convert to DebtTransaction format (only unpaid order transactions)
    const debtTransactions = orderTransactions.map((t)=>({
            systemId: t.systemId,
            orderId: t.orderId,
            orderDate: t.orderDate,
            amount: t.amount,
            dueDate: t.dueDate,
            isPaid: currentDebt === 0,
            remainingAmount: currentDebt === 0 ? 0 : t.remainingAmount,
            notes: t.notes
        }));
    return {
        currentDebt,
        debtTransactions
    };
}
function useComputedCustomerDebt(customer) {
    const { data: allOrders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useAllOrders"])();
    const { data: allReceipts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"])();
    const { data: allPayments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!customer) return null;
        return computeCustomerDebtTransactions(customer, allOrders, allReceipts, allPayments);
    }, [
        customer,
        allOrders,
        allReceipts,
        allPayments
    ]);
}
function useAllCustomersComputedDebt(customers) {
    const { data: allOrders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useAllOrders"])();
    const { data: allReceipts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"])();
    const { data: allPayments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const debtMap = new Map();
        for (const customer of customers){
            const debtInfo = computeCustomerDebtTransactions(customer, allOrders, allReceipts, allPayments);
            debtMap.set(customer.systemId, debtInfo);
        }
        return debtMap;
    }, [
        customers,
        allOrders,
        allReceipts,
        allPayments
    ]);
}
function useCustomersWithComputedDebt(customers) {
    const { data: allOrders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useAllOrders"])();
    const { data: allReceipts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"])();
    const { data: allPayments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return customers.map((customer)=>{
            const debtInfo = computeCustomerDebtTransactions(customer, allOrders, allReceipts, allPayments);
            return {
                ...customer,
                currentDebt: debtInfo.currentDebt,
                debtTransactions: debtInfo.debtTransactions
            };
        });
    }, [
        customers,
        allOrders,
        allReceipts,
        allPayments
    ]);
}
}),
"[project]/features/customers/sla/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerSlaEvaluation",
    ()=>useCustomerSlaEvaluation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/sla-settings-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$computed$2d$debt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/hooks/use-computed-debt.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function useCustomerSlaEvaluation() {
    const customers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"])((state)=>state.data);
    const slaSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSlaStore"])((state)=>state.data);
    const evaluate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSlaEngineStore"])((state)=>state.evaluate);
    const storeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSlaEngineStore"])();
    // Use computed debt from orders/receipts instead of static currentDebt field
    const customersWithDebt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$computed$2d$debt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomersWithComputedDebt"])(customers);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!customersWithDebt.length || !slaSettings.length) return;
        evaluate(customersWithDebt, slaSettings);
    }, [
        customersWithDebt,
        slaSettings,
        evaluate
    ]);
    return storeState;
}
}),
"[project]/features/customers/hooks/use-customers-query.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomersQuery",
    ()=>useCustomersQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$customer$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/customer-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/store.ts [app-ssr] (ecmascript)");
;
;
;
;
function useCustomersQuery(params) {
    // Subscribe to store data changes to trigger re-fetch
    const storeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"])((state)=>state.data);
    const slaLastEvaluated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSlaEngineStore"])((state)=>state.lastEvaluatedAt);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'customers',
            params,
            storeData.length,
            storeData.filter((c)=>c.isDeleted).length,
            slaLastEvaluated
        ],
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$customer$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomersPage"])(params),
        staleTime: 30_000
    });
}
}),
"[project]/features/customers/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomersPage",
    ()=>CustomersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-ssr] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react/shallow.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/hooks/use-all-customer-settings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-all-branches.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/columns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$customer$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/customer-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-persistent-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-column-visibility.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-media-query.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-debounce.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
// ✅ customerImportExportConfig moved to customer-import-export-dialogs.tsx for lazy loading
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-date-filter.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/touch-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$mobile$2d$search$2d$bar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/mobile-search-bar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/hooks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$customers$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/hooks/use-customers-query.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$computed$2d$debt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/hooks/use-computed-debt.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
;
;
;
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
// ✅ Dynamic imports for heavy dialog components (non-generic)
const BulkActionConfirmDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/features/customers/components/bulk-action-confirm-dialog.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
// ✅ Dynamic imports for Import/Export dialogs - lazy loads XLSX library (~500KB) + config
const CustomerImportDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/features/customers/components/customer-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const CustomerExportDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/features/customers/components/customer-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
;
;
;
;
;
;
;
const TABLE_STATE_STORAGE_KEY = "customers-table-state";
const MOBILE_ROW_HEIGHT = 190;
const MOBILE_LIST_HEIGHT = 520;
const defaultTableState = {
    search: "",
    statusFilter: "all",
    typeFilter: "all",
    dateRange: undefined,
    showDeleted: false,
    slaFilter: "all",
    debtFilter: "all",
    pagination: {
        pageIndex: 0,
        pageSize: 10
    },
    sorting: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$customer$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_CUSTOMER_SORT"]
};
function resolveStateAction(current, action) {
    return typeof action === "function" ? action(current) : action;
}
function CustomersPage() {
    const { data: customers, remove, removeMany, restore, restoreMany, addMultiple, updateManyStatus, update } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShallow"])((state)=>({
            data: state.data,
            remove: state.remove,
            removeMany: state.removeMany,
            restore: state.restore,
            restoreMany: state.restoreMany,
            addMultiple: state.addMultiple,
            updateManyStatus: state.updateManyStatus,
            update: state.update
        })));
    const { data: customerTypesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActiveCustomerTypes"])();
    const { data: branches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 768px)");
    // Use computed debt from orders/receipts instead of static currentDebt field
    const customersWithDebt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$computed$2d$debt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomersWithComputedDebt"])(customers);
    const deletedCount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>customers.filter((customer)=>customer.isDeleted).length, [
        customers
    ]);
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                size: "sm",
                className: "h-9",
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/customers/trash",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/customers/page.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this),
                        "Thùng rác (",
                        deletedCount,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/page.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this)
            }, "trash", false, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                size: "sm",
                className: "h-9",
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/customers/new",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/customers/page.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this),
                        "Thêm khách hàng"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/page.tsx",
                    lineNumber: 154,
                    columnNumber: 9
                }, this)
            }, "add", false, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ], [
        deletedCount
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: 'Danh sách khách hàng',
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: '/',
                isCurrent: false
            },
            {
                label: 'Khách hàng',
                href: '/customers',
                isCurrent: true
            }
        ],
        showBackButton: false,
        actions: headerActions
    });
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    const [isAlertOpen, setIsAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [idToDelete, setIdToDelete] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [expanded, setExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    const [pendingAction, setPendingAction] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [showImportDialog, setShowImportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [showExportDialog, setShowExportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [columnVisibility, setColumnVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useColumnVisibility"])('customers', {});
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [tableState, setTableState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePersistentState"])(TABLE_STATE_STORAGE_KEY, defaultTableState);
    const queryParams = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            ...tableState,
            showDeleted: false
        }), [
        tableState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$customers$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomersQuery"])(queryParams);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (tableState.showDeleted) {
            setTableState((prev)=>({
                    ...prev,
                    showDeleted: false
                }));
        }
    }, [
        tableState.showDeleted,
        setTableState
    ]);
    const handleDelete = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        setIdToDelete(systemId);
        setIsAlertOpen(true);
    }, []);
    const handleRestore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        restore((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId));
    }, [
        restore
    ]);
    const slaEngine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSlaEvaluation"])();
    const slaIndex = slaEngine.index;
    const slaSummary = slaEngine.summary;
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(handleDelete, handleRestore, router, {
            slaIndex
        }), [
        handleDelete,
        handleRestore,
        router,
        slaIndex
    ]);
    const columnDefaultsInitialized = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](false);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (columnDefaultsInitialized.current) return;
        if (columns.length === 0) return;
        const defaultVisibleColumns = [
            "id",
            "name",
            "email",
            "phone",
            "shippingAddress",
            "status",
            "slaStatus",
            "accountManagerName"
        ];
        const initialVisibility = {};
        columns.forEach((column)=>{
            if (!column.id) return;
            const alwaysVisible = column.id === "select" || column.id === "actions";
            initialVisibility[column.id] = alwaysVisible || defaultVisibleColumns.includes(column.id);
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columns.map((column)=>column.id).filter(Boolean));
        columnDefaultsInitialized.current = true;
    }, [
        columns,
        setColumnVisibility
    ]);
    const updateTableState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((updater)=>{
        setTableState((prev)=>updater(prev));
    }, [
        setTableState
    ]);
    const handleSearchChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                search: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleStatusFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                statusFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleTypeFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                typeFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleDateRangeChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                dateRange: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handlePaginationChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((action)=>{
        updateTableState((prev)=>({
                ...prev,
                pagination: resolveStateAction(prev.pagination, action)
            }));
    }, [
        updateTableState
    ]);
    const handleSortingChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((action)=>{
        updateTableState((prev)=>{
            const nextSortingSource = typeof action === "function" ? action({
                ...prev.sorting
            }) : action;
            return {
                ...prev,
                sorting: {
                    id: nextSortingSource.id ?? prev.sorting.id,
                    desc: nextSortingSource.desc
                }
            };
        });
    }, [
        updateTableState
    ]);
    // Debounce search for performance
    const debouncedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDebounce"])(tableState.search, 300);
    // Fuse instance for search - use customersWithDebt to include computed debt
    const fuseInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](customersWithDebt, {
            keys: [
                'name',
                'email',
                'phone',
                'company',
                'taxCode',
                'id'
            ],
            threshold: 0.3,
            ignoreLocation: true
        });
    }, [
        customersWithDebt
    ]);
    // Filter data using useMemo - reactive to store changes
    // Use customersWithDebt instead of static customers data
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        // Start with non-deleted customers
        let dataset = customersWithDebt.filter((customer)=>!customer.isDeleted);
        // Apply status filter
        if (tableState.statusFilter !== 'all') {
            dataset = dataset.filter((customer)=>customer.status === tableState.statusFilter);
        }
        // Apply type filter
        if (tableState.typeFilter !== 'all') {
            dataset = dataset.filter((customer)=>customer.type === tableState.typeFilter);
        }
        // Apply date range filter
        if (tableState.dateRange && (tableState.dateRange[0] || tableState.dateRange[1])) {
            dataset = dataset.filter((customer)=>{
                if (!customer.createdAt) return false;
                const createdDate = new Date(customer.createdAt);
                const fromDate = tableState.dateRange[0] ? new Date(tableState.dateRange[0]) : null;
                const toDate = tableState.dateRange[1] ? new Date(tableState.dateRange[1]) : null;
                if (fromDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateBefore"])(createdDate, fromDate)) return false;
                if (toDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(createdDate, toDate)) return false;
                return true;
            });
        }
        // Apply SLA filter
        if (tableState.slaFilter !== 'all') {
            const relevantSystemIds = new Set();
            if (tableState.slaFilter === 'followUp') {
                slaEngine.index?.followUpAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            } else if (tableState.slaFilter === 'reengage') {
                slaEngine.index?.reEngagementAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            } else if (tableState.slaFilter === 'debt') {
                slaEngine.index?.debtAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            } else if (tableState.slaFilter === 'health') {
                slaEngine.index?.healthAlerts.forEach((alert)=>relevantSystemIds.add(alert.systemId));
            }
            dataset = dataset.filter((customer)=>relevantSystemIds.has(customer.systemId));
        }
        // Apply Debt filter
        if (tableState.debtFilter !== 'all') {
            if (tableState.debtFilter === 'totalOverdue' || tableState.debtFilter === 'overdue') {
                dataset = dataset.filter((customer)=>{
                    if (!customer.debtReminders || customer.debtReminders.length === 0) return false;
                    const now = new Date();
                    return customer.debtReminders.some((reminder)=>{
                        if (!reminder.dueDate) {
                            return false;
                        }
                        const dueDate = new Date(reminder.dueDate);
                        const amountDue = reminder.amountDue ?? 0;
                        return dueDate < now && amountDue > 0;
                    });
                });
            } else if (tableState.debtFilter === 'dueSoon') {
                dataset = dataset.filter((customer)=>{
                    if (!customer.debtReminders || customer.debtReminders.length === 0) return false;
                    const now = new Date();
                    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
                    return customer.debtReminders.some((reminder)=>{
                        if (!reminder.dueDate) {
                            return false;
                        }
                        const dueDate = new Date(reminder.dueDate);
                        const amountDue = reminder.amountDue ?? 0;
                        return dueDate >= now && dueDate <= threeDaysLater && amountDue > 0;
                    });
                });
            } else if (tableState.debtFilter === 'hasDebt') {
                dataset = dataset.filter((customer)=>(customer.currentDebt || 0) > 0);
            }
        }
        // Apply search filter
        if (debouncedSearch.trim()) {
            fuseInstance.setCollection(dataset);
            dataset = fuseInstance.search(debouncedSearch.trim()).map((result)=>result.item);
        }
        return dataset;
    }, [
        customersWithDebt,
        tableState.statusFilter,
        tableState.typeFilter,
        tableState.dateRange,
        tableState.slaFilter,
        tableState.debtFilter,
        debouncedSearch,
        fuseInstance,
        slaEngine.index
    ]);
    // Sort data
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const sorted = [
            ...filteredData
        ];
        const sortKey = tableState.sorting.id;
        sorted.sort((a, b)=>{
            const aValue = a[sortKey] ?? '';
            const bValue = b[sortKey] ?? '';
            // Special handling for date columns
            if (sortKey === 'createdAt') {
                const aTime = aValue ? new Date(aValue).getTime() : 0;
                const bTime = bValue ? new Date(bValue).getTime() : 0;
                // Nếu thời gian bằng nhau, sort theo systemId (ID mới hơn = số lớn hơn)
                if (aTime === bTime) {
                    const aNum = parseInt(a.systemId.replace(/\D/g, '')) || 0;
                    const bNum = parseInt(b.systemId.replace(/\D/g, '')) || 0;
                    return tableState.sorting.desc ? bNum - aNum : aNum - bNum;
                }
                return tableState.sorting.desc ? bTime - aTime : aTime - bTime;
            }
            if (aValue < bValue) return tableState.sorting.desc ? 1 : -1;
            if (aValue > bValue) return tableState.sorting.desc ? -1 : 1;
            return 0;
        });
        return sorted;
    }, [
        filteredData,
        tableState.sorting
    ]);
    // Pagination
    const totalRows = sortedData.length;
    const pageCount = Math.max(1, Math.ceil(totalRows / tableState.pagination.pageSize));
    const pageData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = tableState.pagination.pageIndex * tableState.pagination.pageSize;
        const end = start + tableState.pagination.pageSize;
        return sortedData.slice(start, end);
    }, [
        sortedData,
        tableState.pagination
    ]);
    const selectedCustomers = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>customers.filter((customer)=>rowSelection[customer.systemId]), [
        customers,
        rowSelection
    ]);
    const confirmDelete = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (idToDelete) {
            remove((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(idToDelete));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Đã chuyển khách hàng vào thùng rác");
        }
        setIsAlertOpen(false);
        setIdToDelete(null);
    }, [
        idToDelete,
        remove
    ]);
    const handleRowClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((customer)=>{
        router.push(`/customers/${customer.systemId}`);
    }, [
        router
    ]);
    // Active customers (non-deleted) for import/export operations
    const activeCustomers = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>customers.filter((c)=>!c.isDeleted), [
        customers
    ]);
    // ===== IMPORT/EXPORT V2 =====
    // V2 Import handler with upsert support (like employees)
    const handleImportV2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (data, mode, _branchId)=>{
        let inserted = 0;
        let updated = 0;
        let skipped = 0;
        let failed = 0;
        const errors = [];
        for(let i = 0; i < data.length; i++){
            const item = data[i];
            try {
                // Find existing by business ID (id field like KH000001)
                const existingCustomer = item.id ? activeCustomers.find((c)=>c.id === item.id) : null;
                if (existingCustomer) {
                    if (mode === 'insert-only') {
                        skipped++;
                        continue;
                    }
                    // Update existing
                    update(existingCustomer.systemId, {
                        ...existingCustomer,
                        ...item
                    });
                    updated++;
                } else {
                    if (mode === 'update-only') {
                        errors.push({
                            row: i + 2,
                            message: `Không tìm thấy khách hàng với mã ${item.id}`
                        });
                        failed++;
                        continue;
                    }
                    // Insert new - remove systemId if present
                    const { systemId: _systemId, ...newData } = item;
                    const dataWithEmptyId = {
                        ...newData,
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(""),
                        status: newData.status || "Đang giao dịch"
                    };
                    addMultiple([
                        dataWithEmptyId
                    ]);
                    inserted++;
                }
            } catch (error) {
                errors.push({
                    row: i + 2,
                    message: String(error)
                });
                failed++;
            }
        }
        return {
            success: inserted + updated,
            failed,
            inserted,
            updated,
            skipped,
            errors
        };
    }, [
        activeCustomers,
        addMultiple,
        update
    ]);
    // Current user for logging (mock - replace with actual auth)
    const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            name: 'Admin',
            systemId: 'USR000001'
        }), []);
    const bulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        // Main list only shows non-deleted customers
        return [
            {
                label: "Chuyển vào thùng rác",
                onSelect: (rows)=>setPendingAction({
                        kind: "delete",
                        customers: rows
                    })
            },
            {
                label: "Đang giao dịch",
                onSelect: (rows)=>setPendingAction({
                        kind: "status",
                        status: "Đang giao dịch",
                        customers: rows
                    })
            },
            {
                label: "Ngừng giao dịch",
                onSelect: (rows)=>setPendingAction({
                        kind: "status",
                        status: "Ngừng Giao Dịch",
                        customers: rows
                    })
            }
        ];
    }, []);
    const bulkDialogCopy = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!pendingAction) return null;
        switch(pendingAction.kind){
            case "delete":
                return {
                    title: "Chuyển vào thùng rác",
                    description: `Xác nhận chuyển ${pendingAction.customers.length} khách hàng vào thùng rác?`,
                    confirmLabel: "Chuyển vào thùng rác"
                };
            case "restore":
                return {
                    title: "Khôi phục khách hàng",
                    description: `Khôi phục ${pendingAction.customers.length} khách hàng đã chọn?`,
                    confirmLabel: "Khôi phục"
                };
            case "status":
                return {
                    title: "Cập nhật trạng thái",
                    description: `Xác nhận cập nhật ${pendingAction.customers.length} khách hàng sang trạng thái "${pendingAction.status}"?`,
                    confirmLabel: "Cập nhật"
                };
            default:
                return null;
        }
    }, [
        pendingAction
    ]);
    const handleConfirmBulkAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (!pendingAction) return;
        const systemIds = pendingAction.customers.map((customer)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(customer.systemId));
        if (pendingAction.kind === "delete") {
            removeMany(systemIds);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã chuyển ${pendingAction.customers.length} khách hàng vào thùng rác`);
        } else if (pendingAction.kind === "restore") {
            restoreMany(systemIds);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã khôi phục ${pendingAction.customers.length} khách hàng`);
        } else if (pendingAction.kind === "status") {
            updateManyStatus(systemIds, pendingAction.status);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã cập nhật trạng thái cho ${pendingAction.customers.length} khách hàng`);
        }
        setRowSelection((prev)=>{
            const next = {
                ...prev
            };
            pendingAction.customers.forEach((customer)=>{
                delete next[customer.systemId];
            });
            return next;
        });
        setPendingAction(null);
    }, [
        pendingAction,
        removeMany,
        restoreMany,
        updateManyStatus
    ]);
    const getStatusVariant = (status)=>{
        switch(status){
            case "Đang giao dịch":
                return "default";
            case "Ngừng giao dịch":
            case "Ngừng Giao Dịch":
                return "secondary";
            case "Nợ xấu":
                return "destructive";
            default:
                return "default";
        }
    };
    const MobileCustomerCard = ({ customer })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
            className: "cursor-pointer hover:shadow-md transition-shadow",
            onClick: ()=>handleRowClick(customer),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                            className: "h-12 w-12 flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                    src: "",
                                    alt: customer.name
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 637,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                    className: "bg-primary/10 text-primary font-semibold",
                                    children: customer.name.split(" ").map((n)=>n[0]).join("").slice(0, 2)
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 638,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/page.tsx",
                            lineNumber: 636,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold text-body-sm truncate",
                                                    children: customer.name
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-body-xs text-muted-foreground",
                                                    children: customer.id
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 646,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 644,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TouchButton"], {
                                                        variant: "ghost",
                                                        size: "sm",
                                                        className: "h-8 w-8 p-0",
                                                        onClick: (event)=>event.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 651,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 650,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 649,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                    align: "end",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                            onClick: (event)=>{
                                                                event.stopPropagation();
                                                                router.push(`/customers/${customer.systemId}/edit`);
                                                            },
                                                            children: "Chỉnh sửa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                            onClick: (event)=>{
                                                                event.stopPropagation();
                                                                handleDelete(customer.systemId);
                                                            },
                                                            children: "Chuyển vào thùng rác"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 663,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 648,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 mt-2",
                                    children: [
                                        customer.company && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                    className: "h-3 w-3 mr-1.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 677,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: customer.company
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 678,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 676,
                                            columnNumber: 17
                                        }, this),
                                        customer.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "h-3 w-3 mr-1.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 683,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: customer.email
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 682,
                                            columnNumber: 17
                                        }, this),
                                        customer.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "h-3 w-3 mr-1.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 689,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: customer.phone
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 690,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 688,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 674,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mt-3 pt-2 border-t",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: getStatusVariant(customer.status),
                                            className: "text-body-xs",
                                            children: customer.status
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 695,
                                            columnNumber: 15
                                        }, this),
                                        customer.accountManagerName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-body-xs text-muted-foreground",
                                            children: [
                                                "NV: ",
                                                customer.accountManagerName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 699,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 694,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/page.tsx",
                            lineNumber: 642,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/page.tsx",
                    lineNumber: 635,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 634,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/customers/page.tsx",
            lineNumber: 633,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 space-y-4",
                        children: [
                            isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TouchButton"], {
                                        onClick: ()=>router.push("/customers/new"),
                                        size: "default",
                                        className: "w-full min-h-touch",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 715,
                                                columnNumber: 17
                                            }, this),
                                            "Thêm khách hàng"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 714,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>setShowImportDialog(true),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Nhập"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 719,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>setShowExportDialog(true),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Xuất"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 723,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                                                columns: columns,
                                                columnVisibility: columnVisibility,
                                                setColumnVisibility: setColumnVisibility,
                                                columnOrder: columnOrder,
                                                setColumnOrder: setColumnOrder,
                                                pinnedColumns: pinnedColumns,
                                                setPinnedColumns: setPinnedColumns
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 727,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 718,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/customers/page.tsx",
                                lineNumber: 713,
                                columnNumber: 13
                            }, this) : null,
                            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: ()=>setShowImportDialog(true),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 744,
                                                columnNumber: 17
                                            }, this),
                                            "Nhập file"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 743,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: ()=>setShowExportDialog(true),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 748,
                                                columnNumber: 17
                                            }, this),
                                            "Xuất Excel"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 747,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                                        columns: columns,
                                        columnVisibility: columnVisibility,
                                        setColumnVisibility: setColumnVisibility,
                                        columnOrder: columnOrder,
                                        setColumnOrder: setColumnOrder,
                                        pinnedColumns: pinnedColumns,
                                        setPinnedColumns: setPinnedColumns
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 751,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/customers/page.tsx",
                                lineNumber: 742,
                                columnNumber: 13
                            }, this),
                            isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$mobile$2d$search$2d$bar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileSearchBar"], {
                                        value: tableState.search,
                                        onChange: handleSearchChange,
                                        placeholder: "Tìm kiếm khách hàng..."
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 765,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                value: tableState.debtFilter,
                                                onValueChange: (value)=>{
                                                    updateTableState((prev)=>({
                                                            ...prev,
                                                            debtFilter: value,
                                                            pagination: {
                                                                ...prev.pagination,
                                                                pageIndex: 0
                                                            }
                                                        }));
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        className: "h-9",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                            placeholder: "Công nợ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 775,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 774,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "all",
                                                                children: "Tất cả công nợ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 778,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "totalOverdue",
                                                                children: "Tổng quá hạn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 779,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "overdue",
                                                                children: "Quá hạn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 780,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "dueSoon",
                                                                children: "Sắp đến hạn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 781,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "hasDebt",
                                                                children: "Có công nợ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 782,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 777,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 767,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                value: tableState.slaFilter,
                                                onValueChange: (value)=>{
                                                    updateTableState((prev)=>({
                                                            ...prev,
                                                            slaFilter: value,
                                                            pagination: {
                                                                ...prev.pagination,
                                                                pageIndex: 0
                                                            }
                                                        }));
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        className: "h-9",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                            placeholder: "Cảnh báo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 793,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 792,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "all",
                                                                children: "Tất cả cảnh báo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 796,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "followUp",
                                                                children: "Cần liên hệ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 797,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "reengage",
                                                                children: "Lâu không mua hàng"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 798,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "debt",
                                                                children: "Cảnh báo công nợ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 799,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "health",
                                                                children: "Nguy cơ mất khách"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 800,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 785,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                value: tableState.statusFilter,
                                                onValueChange: handleStatusFilterChange,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        className: "h-9",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                            placeholder: "Trạng thái"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 805,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 804,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "all",
                                                                children: "Tất cả trạng thái"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 808,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Đang giao dịch",
                                                                children: "Đang giao dịch"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 809,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Ngừng Giao Dịch",
                                                                children: "Ngừng giao dịch"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 810,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 803,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                value: tableState.typeFilter,
                                                onValueChange: handleTypeFilterChange,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        className: "h-9",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                            placeholder: "Loại KH"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 815,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 814,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "all",
                                                                children: "Tất cả loại KH"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/customers/page.tsx",
                                                                lineNumber: 818,
                                                                columnNumber: 21
                                                            }, this),
                                                            customerTypesData.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: type.id,
                                                                    children: type.name
                                                                }, type.systemId, false, {
                                                                    fileName: "[project]/features/customers/page.tsx",
                                                                    lineNumber: 820,
                                                                    columnNumber: 23
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 817,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 813,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 766,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center pt-2 border-t",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-body-sm text-muted-foreground",
                                            children: [
                                                sortedData.length,
                                                " khách hàng"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/page.tsx",
                                            lineNumber: 828,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 827,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/customers/page.tsx",
                                lineNumber: 764,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageFilters"], {
                                searchValue: tableState.search,
                                onSearchChange: handleSearchChange,
                                searchPlaceholder: "Tìm kiếm khách hàng...",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableDateFilter"], {
                                        value: tableState.dateRange,
                                        onChange: handleDateRangeChange,
                                        title: "Ngày tạo"
                                    }, void 0, false, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 833,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        value: tableState.debtFilter,
                                        onValueChange: (value)=>{
                                            updateTableState((prev)=>({
                                                    ...prev,
                                                    debtFilter: value,
                                                    pagination: {
                                                        ...prev.pagination,
                                                        pageIndex: 0
                                                    }
                                                }));
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[180px] h-9",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "Công nợ"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 844,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 843,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "Tất cả công nợ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 847,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "totalOverdue",
                                                        children: "Tổng công nợ quá hạn"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 848,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "overdue",
                                                        children: "Quá hạn thanh toán"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "dueSoon",
                                                        children: "Sắp đến hạn"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "hasDebt",
                                                        children: "Có công nợ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 851,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 846,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 836,
                                        columnNumber: 15
                                    }, this),
                                    slaSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        value: tableState.slaFilter,
                                        onValueChange: (value)=>{
                                            updateTableState((prev)=>({
                                                    ...prev,
                                                    slaFilter: value,
                                                    pagination: {
                                                        ...prev.pagination,
                                                        pageIndex: 0
                                                    }
                                                }));
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[180px] h-9",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "Cảnh báo"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 865,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 864,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "Tất cả cảnh báo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 868,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "followUp",
                                                        children: [
                                                            "Cần liên hệ (",
                                                            slaSummary.followUpAlerts,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 869,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "reengage",
                                                        children: [
                                                            "Lâu không mua hàng (",
                                                            slaSummary.reEngagementAlerts,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "debt",
                                                        children: [
                                                            "Cảnh báo công nợ (",
                                                            slaSummary.debtAlerts,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 871,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "health",
                                                        children: [
                                                            "Nguy cơ mất khách (",
                                                            slaSummary.healthAlerts,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 872,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 867,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 857,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        value: tableState.statusFilter,
                                        onValueChange: handleStatusFilterChange,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[160px] h-9",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "Trạng thái"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 880,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 879,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "Tất cả trạng thái"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 883,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "Đang giao dịch",
                                                        children: "Đang giao dịch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 884,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "Ngừng Giao Dịch",
                                                        children: "Ngừng giao dịch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 885,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 882,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 878,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        value: tableState.typeFilter,
                                        onValueChange: handleTypeFilterChange,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[160px] h-9",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "Loại KH"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/page.tsx",
                                                    lineNumber: 892,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 891,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "Tất cả loại"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/customers/page.tsx",
                                                        lineNumber: 895,
                                                        columnNumber: 19
                                                    }, this),
                                                    customerTypesData.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: type.id,
                                                            children: type.name
                                                        }, type.systemId, false, {
                                                            fileName: "[project]/features/customers/page.tsx",
                                                            lineNumber: 897,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/customers/page.tsx",
                                                lineNumber: 894,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/page.tsx",
                                        lineNumber: 890,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/customers/page.tsx",
                                lineNumber: 832,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/customers/page.tsx",
                        lineNumber: 711,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                            columns: columns,
                            data: pageData,
                            renderMobileCard: (customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileCustomerCard, {
                                    customer: customer
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 911,
                                    columnNumber: 45
                                }, void 0),
                            pageCount: pageCount,
                            pagination: tableState.pagination,
                            setPagination: handlePaginationChange,
                            rowCount: totalRows,
                            rowSelection: rowSelection,
                            setRowSelection: setRowSelection,
                            bulkActions: bulkActions,
                            allSelectedRows: selectedCustomers,
                            sorting: tableState.sorting,
                            setSorting: handleSortingChange,
                            expanded: expanded,
                            setExpanded: setExpanded,
                            columnVisibility: columnVisibility,
                            setColumnVisibility: setColumnVisibility,
                            columnOrder: columnOrder,
                            setColumnOrder: setColumnOrder,
                            pinnedColumns: pinnedColumns,
                            setPinnedColumns: setPinnedColumns,
                            onRowClick: handleRowClick,
                            mobileVirtualized: true,
                            mobileRowHeight: MOBILE_ROW_HEIGHT,
                            mobileListHeight: MOBILE_LIST_HEIGHT
                        }, void 0, false, {
                            fileName: "[project]/features/customers/page.tsx",
                            lineNumber: 908,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/customers/page.tsx",
                        lineNumber: 907,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 710,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isAlertOpen,
                onOpenChange: setIsAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Bạn có chắc chắn muốn xóa?"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 941,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Khách hàng sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau."
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 942,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/page.tsx",
                            lineNumber: 940,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 947,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: confirmDelete,
                                    children: "Xóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/page.tsx",
                                    lineNumber: 948,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/page.tsx",
                            lineNumber: 946,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/page.tsx",
                    lineNumber: 939,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 938,
                columnNumber: 7
            }, this),
            pendingAction && bulkDialogCopy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BulkActionConfirmDialog, {
                open: true,
                title: bulkDialogCopy.title,
                description: bulkDialogCopy.description,
                confirmLabel: bulkDialogCopy.confirmLabel,
                customers: pendingAction.customers,
                onConfirm: handleConfirmBulkAction,
                onCancel: ()=>setPendingAction(null)
            }, void 0, false, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 954,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomerImportDialog, {
                open: showImportDialog,
                onOpenChange: setShowImportDialog,
                branches: branches.map((b)=>({
                        systemId: b.systemId,
                        name: b.name
                    })),
                existingData: activeCustomers,
                onImport: handleImportV2,
                currentUser: currentUser
            }, void 0, false, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 966,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomerExportDialog, {
                open: showExportDialog,
                onOpenChange: setShowExportDialog,
                allData: activeCustomers,
                filteredData: sortedData,
                currentPageData: pageData,
                selectedData: selectedCustomers,
                currentUser: currentUser
            }, void 0, false, {
                fileName: "[project]/features/customers/page.tsx",
                lineNumber: 976,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/customers/page.tsx",
        lineNumber: 709,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_b5fa6bba._.js.map