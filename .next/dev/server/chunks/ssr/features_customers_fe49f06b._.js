module.exports = [
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
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'customers', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/customers'
});
// ✅ API Sync helpers
const API_ENDPOINT = '/api/customers';
const syncToApi = {
    create: async (customer)=>{
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            });
            if (!response.ok) console.warn('[Customer API] Create sync failed');
            else console.log('[Customer API] Created:', customer.systemId);
        } catch (e) {
            console.warn('[Customer API] Create sync error:', e);
        }
    },
    update: async (systemId, updates)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) console.warn('[Customer API] Update sync failed');
            else console.log('[Customer API] Updated:', systemId);
        } catch (e) {
            console.warn('[Customer API] Update sync error:', e);
        }
    },
    delete: async (systemId, hard = false)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hard
                })
            });
            if (!response.ok) console.warn('[Customer API] Delete sync failed');
            else console.log('[Customer API] Deleted:', systemId);
        } catch (e) {
            console.warn('[Customer API] Delete sync error:', e);
        }
    },
    restore: async (systemId)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}/restore`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) console.warn('[Customer API] Restore sync failed');
            else console.log('[Customer API] Restored:', systemId);
        } catch (e) {
            console.warn('[Customer API] Restore sync error:', e);
        }
    }
};
// ✅ Wrap base store methods with API sync
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
const originalRemove = baseStore.getState().remove;
const originalHardDelete = baseStore.getState().hardDelete;
const originalRestore = baseStore.getState().restore;
baseStore.setState({
    add: (item)=>{
        const result = originalAdd(item);
        syncToApi.create(result);
        return result;
    },
    update: (systemId, updates)=>{
        originalUpdate(systemId, updates);
        syncToApi.update(systemId, updates);
    },
    remove: (systemId)=>{
        originalRemove(systemId);
        syncToApi.delete(systemId, false);
    },
    hardDelete: (systemId)=>{
        originalHardDelete(systemId);
        syncToApi.delete(systemId, true);
    },
    restore: (systemId)=>{
        originalRestore(systemId);
        syncToApi.restore(systemId);
    }
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
                        const newDebt = (customer.currentDebt || 0) + amountChange;
                        // Sync to API
                        syncToApi.update(systemId, {
                            currentDebt: newDebt
                        });
                        return {
                            ...customer,
                            currentDebt: newDebt
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
"[project]/features/customers/api/customers-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customers API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */ __turbopack_context__.s([
    "createCustomer",
    ()=>createCustomer,
    "deleteCustomer",
    ()=>deleteCustomer,
    "fetchCustomer",
    ()=>fetchCustomer,
    "fetchCustomerDebt",
    ()=>fetchCustomerDebt,
    "fetchCustomerOrders",
    ()=>fetchCustomerOrders,
    "fetchCustomers",
    ()=>fetchCustomers,
    "searchCustomers",
    ()=>searchCustomers,
    "updateCustomer",
    ()=>updateCustomer
]);
const API_BASE = '/api/customers';
async function fetchCustomers(params = {}) {
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
    const res = await fetch(`${API_BASE}?${searchParams}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch customers: ${res.statusText}`);
    }
    return res.json();
}
async function fetchCustomer(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch customer ${id}: ${res.statusText}`);
    }
    return res.json();
}
async function createCustomer(data) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to create customer: ${res.statusText}`);
    }
    return res.json();
}
async function updateCustomer({ systemId, ...data }) {
    const res = await fetch(`${API_BASE}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to update customer: ${res.statusText}`);
    }
    return res.json();
}
async function deleteCustomer(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to delete customer: ${res.statusText}`);
    }
}
async function searchCustomers(query, limit = 20) {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to search customers: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
async function fetchCustomerDebt(customerId) {
    const res = await fetch(`${API_BASE}/${customerId}/debt`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch customer debt: ${res.statusText}`);
    }
    return res.json();
}
async function fetchCustomerOrders(customerId, params = {}) {
    const { page = 1, limit = 20 } = params;
    const res = await fetch(`${API_BASE}/${customerId}/orders?page=${page}&limit=${limit}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch customer orders: ${res.statusText}`);
    }
    return res.json();
}
}),
"[project]/features/customers/hooks/use-customers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "customerKeys",
    ()=>customerKeys,
    "useActiveCustomers",
    ()=>useActiveCustomers,
    "useCustomer",
    ()=>useCustomer,
    "useCustomerDebt",
    ()=>useCustomerDebt,
    "useCustomerMutations",
    ()=>useCustomerMutations,
    "useCustomerOrders",
    ()=>useCustomerOrders,
    "useCustomerSearch",
    ()=>useCustomerSearch,
    "useCustomers",
    ()=>useCustomers,
    "useCustomersWithDebt",
    ()=>useCustomersWithDebt,
    "useVIPCustomers",
    ()=>useVIPCustomers
]);
/**
 * useCustomers - React Query hooks for customers
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useCustomers } from '@/features/customers/hooks/use-customers'
 * - NEVER import from '@/features/customers' or '@/features/customers/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/api/customers-api.ts [app-ssr] (ecmascript)");
;
;
const customerKeys = {
    all: [
        'customers'
    ],
    lists: ()=>[
            ...customerKeys.all,
            'list'
        ],
    list: (params)=>[
            ...customerKeys.lists(),
            params
        ],
    details: ()=>[
            ...customerKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...customerKeys.details(),
            id
        ],
    search: (query)=>[
            ...customerKeys.all,
            'search',
            query
        ],
    debt: (id)=>[
            ...customerKeys.all,
            'debt',
            id
        ],
    orders: (id, params)=>[
            ...customerKeys.all,
            'orders',
            id,
            params
        ]
};
function useCustomers(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomers"])(params),
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useCustomer(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomer"])(id),
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
function useCustomerSearch(query, limit = 20) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerKeys.search(query),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchCustomers"])(query, limit),
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
function useCustomerDebt(customerId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerKeys.debt(customerId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerDebt"])(customerId),
        enabled: !!customerId,
        staleTime: 30_000
    });
}
function useCustomerOrders(customerId, params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerKeys.orders(customerId, params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerOrders"])(customerId, params),
        enabled: !!customerId,
        staleTime: 60_000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useCustomerMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCustomer"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: customerKeys.lists()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomer"],
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: customerKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: customerKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$api$2f$customers$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCustomer"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: customerKeys.all
            });
            options.onDeleteSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        isCreating: create.isPending,
        isUpdating: update.isPending,
        isDeleting: remove.isPending,
        isMutating: create.isPending || update.isPending || remove.isPending
    };
}
function useCustomersWithDebt(params = {}) {
    return useCustomers({
        ...params,
        hasDebt: true
    });
}
function useVIPCustomers(params = {}) {
    return useCustomers({
        ...params,
        lifecycleStage: 'Khách VIP'
    });
}
function useActiveCustomers(params = {}) {
    return useCustomers({
        ...params,
        status: 'active'
    });
}
}),
"[project]/features/customers/hooks/use-all-customers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllCustomers",
    ()=>useAllCustomers,
    "useCustomerFinder",
    ()=>useCustomerFinder
]);
/**
 * useAllCustomers - Convenience hook for components needing all customers as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$customers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/hooks/use-customers.ts [app-ssr] (ecmascript)");
;
;
function useAllCustomers() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$customers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomers"])({
        limit: 30
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useCustomerFinder() {
    const { data } = useAllCustomers();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((c)=>c.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/customers/components/address-form-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddressFormDialog",
    ()=>AddressFormDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * AddressFormDialog
 * Shared dialog component for adding/editing customer addresses
 * Used in: CustomerAddresses, CustomerAddressSelector, OrderFormPage
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/radio-group.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/virtualized-combobox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$ward$2d$district$2d$mapping$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/ward-district-mapping.ts [app-ssr] (ecmascript)");
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
function AddressFormDialog({ isOpen, onOpenChange, onSave, editingAddress, hideDefaultSwitches = false, title, description }) {
    const { data: provinces, getDistrictsByProvinceId, getWards2LevelByProvinceId, getWards3LevelByDistrictId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"])();
    const [addressLevel, setAddressLevel] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('2-level');
    const [formData, setFormData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        label: '',
        street: '',
        province: '',
        provinceId: '',
        district: '',
        districtId: 0,
        ward: '',
        wardId: '',
        wardCode: '',
        contactName: '',
        contactPhone: '',
        notes: '',
        isDefaultShipping: false,
        isDefaultBilling: false,
        inputLevel: '2-level'
    });
    // Reset form when dialog opens/closes or editingAddress changes
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (isOpen) {
            console.log('[AddressFormDialog] Opening with editingAddress:', editingAddress);
            if (editingAddress) {
                const level = editingAddress.inputLevel || '2-level';
                setAddressLevel(level);
                const newFormData = {
                    label: editingAddress.label || '',
                    street: editingAddress.street || '',
                    province: editingAddress.province || '',
                    provinceId: editingAddress.provinceId || '',
                    district: editingAddress.district || '',
                    districtId: editingAddress.districtId || 0,
                    ward: editingAddress.ward || '',
                    wardId: editingAddress.wardId || '',
                    wardCode: '',
                    contactName: editingAddress.contactName || '',
                    contactPhone: editingAddress.contactPhone || '',
                    notes: editingAddress.notes || '',
                    isDefaultShipping: editingAddress.isDefaultShipping || false,
                    isDefaultBilling: editingAddress.isDefaultBilling || false,
                    inputLevel: level
                };
                console.log('[AddressFormDialog] Setting formData:', newFormData);
                setFormData(newFormData);
            } else {
                setAddressLevel('2-level');
                setFormData({
                    label: '',
                    street: '',
                    province: '',
                    provinceId: '',
                    district: '',
                    districtId: 0,
                    ward: '',
                    wardId: '',
                    wardCode: '',
                    contactName: '',
                    contactPhone: '',
                    notes: '',
                    isDefaultShipping: false,
                    isDefaultBilling: false,
                    inputLevel: '2-level'
                });
            }
        }
    }, [
        isOpen,
        editingAddress
    ]);
    // Get available districts and wards based on selection
    // IMPORTANT: Lookup province by BOTH name and provinceId for compatibility
    const selectedProvince = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        console.log('[AddressFormDialog] Looking for province:', {
            provinceName: formData.province,
            provinceId: formData.provinceId,
            availableProvinces: provinces.slice(0, 5).map((p)=>({
                    id: p.id,
                    name: p.name
                }))
        });
        // First try by name
        let found = provinces.find((p)=>p.name === formData.province);
        if (found) {
            console.log('[AddressFormDialog] Found province by name:', found);
            return found;
        }
        // Then try by provinceId
        if (formData.provinceId) {
            found = provinces.find((p)=>p.id === formData.provinceId);
            if (found) {
                console.log('[AddressFormDialog] Found province by id:', found);
                return found;
            }
        }
        // Try normalized name match
        const normalizedInput = formData.province?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
        if (normalizedInput) {
            found = provinces.find((p)=>{
                const normalizedName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
                return normalizedName === normalizedInput || normalizedName.includes(normalizedInput) || normalizedInput.includes(normalizedName);
            });
            if (found) {
                console.log('[AddressFormDialog] Found province by normalized match:', found);
                return found;
            }
        }
        console.log('[AddressFormDialog] Province NOT FOUND');
        return null;
    }, [
        provinces,
        formData.province,
        formData.provinceId
    ]);
    const availableDistricts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!selectedProvince) return [];
        const districtsFromProvince = getDistrictsByProvinceId(selectedProvince.id);
        // If we have a districtId but it's not in the available list,
        // the district might belong to a different province mapping (e.g. 3-level data)
        // In this case, add it manually to the options
        if (formData.districtId && formData.district) {
            const hasDistrict = districtsFromProvince.some((d)=>d.id === formData.districtId);
            if (!hasDistrict) {
                // Get district by ID directly
                const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
                const districtById = store.getDistrictById(formData.districtId);
                if (districtById) {
                    return [
                        districtById,
                        ...districtsFromProvince
                    ];
                }
                // If still not found, create a virtual entry for display
                return [
                    {
                        systemId: `D${formData.districtId}`,
                        id: formData.districtId,
                        name: formData.district,
                        provinceId: selectedProvince.id
                    },
                    ...districtsFromProvince
                ];
            }
        }
        return districtsFromProvince;
    }, [
        selectedProvince,
        getDistrictsByProvinceId,
        formData.districtId,
        formData.district
    ]);
    // For 3-level: If we have districtId but it's not in availableDistricts,
    // it might be from wards-3level-data with different provinceId mapping
    // In this case, try to get district directly by ID
    const selectedDistrict = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!formData.districtId || formData.districtId === 0) return null;
        // First try from available districts
        const fromAvailable = availableDistricts.find((d)=>d.id === formData.districtId);
        if (fromAvailable) return fromAvailable;
        // Try direct lookup by ID (for cross-province cases)
        const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
        return store.getDistrictById(formData.districtId) || null;
    }, [
        formData.districtId,
        availableDistricts
    ]);
    const availableWards = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (addressLevel === '2-level') {
            if (!selectedProvince) return [];
            return getWards2LevelByProvinceId(selectedProvince.id);
        }
        // For 3-level, use districtId directly (not requiring selectedProvince)
        if (!formData.districtId) return [];
        return getWards3LevelByDistrictId(formData.districtId);
    }, [
        selectedProvince,
        formData.districtId,
        addressLevel,
        getWards2LevelByProvinceId,
        getWards3LevelByDistrictId
    ]);
    // Prepare options for comboboxes
    const provinceOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>provinces.map((p)=>({
                label: p.name,
                value: p.name
            })), [
        provinces
    ]);
    const districtOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const options = availableDistricts.map((d)=>({
                label: d.name,
                value: d.name
            }));
        // If we have a selected district that's not in available list, add it
        if (selectedDistrict && !availableDistricts.find((d)=>d.id === selectedDistrict.id)) {
            options.unshift({
                label: selectedDistrict.name,
                value: selectedDistrict.name
            });
        }
        // If formData has district name but not in options, add it for display
        if (formData.district && !options.some((o)=>o.value === formData.district)) {
            options.unshift({
                label: formData.district,
                value: formData.district
            });
        }
        return options;
    }, [
        availableDistricts,
        selectedDistrict,
        formData.district
    ]);
    // Selected ward for display
    const selectedWard = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!formData.wardId) return null;
        // First try from available wards
        const fromAvailable = availableWards.find((w)=>w.id === formData.wardId);
        if (fromAvailable) return fromAvailable;
        // Try direct lookup by ID
        const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
        return store.getWardById(formData.wardId) || null;
    }, [
        formData.wardId,
        availableWards
    ]);
    const wardOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const options = availableWards.map((w)=>({
                label: w.name,
                value: w.name
            }));
        // If we have a selected ward that's not in available list, add it
        if (selectedWard && !availableWards.find((w)=>w.id === selectedWard.id)) {
            options.unshift({
                label: selectedWard.name,
                value: selectedWard.name
            });
        }
        return options;
    }, [
        availableWards,
        selectedWard
    ]);
    const showValidationError = (message)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Thiếu thông tin', {
            description: message
        });
    };
    const handleSave = ()=>{
        const label = formData.label.trim();
        const street = formData.street.trim();
        if (!label) {
            showValidationError('Vui lòng nhập tên địa chỉ.');
            return;
        }
        if (!street) {
            showValidationError('Vui lòng nhập địa chỉ chi tiết.');
            return;
        }
        if (!formData.province || !formData.provinceId) {
            showValidationError('Vui lòng chọn tỉnh/thành phố.');
            return;
        }
        if (addressLevel === '3-level') {
            if (!formData.district || !formData.districtId) {
                showValidationError('Vui lòng chọn quận/huyện trước khi lưu địa chỉ 3 cấp.');
                return;
            }
            if (!formData.ward || !formData.wardId) {
                showValidationError('Vui lòng chọn phường/xã cho địa chỉ 3 cấp.');
                return;
            }
        } else {
            if (!formData.ward || !formData.wardId) {
                showValidationError('Vui lòng chọn phường/xã cho địa chỉ 2 cấp.');
                return;
            }
        }
        let districtName = formData.district;
        let districtId = formData.districtId;
        let autoFilled = false;
        if (addressLevel === '2-level') {
            try {
                const mapping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$ward$2d$district$2d$mapping$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autoFillDistrict"])({
                    provinceId: formData.provinceId,
                    provinceName: formData.province,
                    wardId: formData.wardId,
                    wardName: formData.ward
                });
                districtName = mapping.districtName;
                districtId = mapping.districtId;
                autoFilled = true;
            } catch (error) {
                showValidationError('Không tìm thấy quận/huyện tương ứng với phường/xã đã chọn.');
                return;
            }
        }
        const addressData = {
            label,
            street,
            province: formData.province,
            provinceId: formData.provinceId,
            district: districtName,
            districtId,
            ward: formData.ward,
            wardId: formData.wardId,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            notes: formData.notes,
            isDefaultShipping: formData.isDefaultShipping,
            isDefaultBilling: formData.isDefaultBilling,
            inputLevel: formData.inputLevel,
            autoFilled
        };
        onSave(addressData);
        onOpenChange(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            className: "text-base sm:text-lg",
                            children: title || (editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới')
                        }, void 0, false, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 371,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            className: "text-sm",
                            children: description || 'Nhập thông tin địa chỉ của khách hàng'
                        }, void 0, false, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                    lineNumber: 370,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-3 py-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "text-sm font-medium",
                                    children: "Loại địa chỉ *"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 382,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RadioGroup"], {
                                    value: addressLevel,
                                    onValueChange: (value)=>{
                                        setAddressLevel(value);
                                        setFormData((prev)=>({
                                                ...prev,
                                                inputLevel: value,
                                                ward: '',
                                                wardId: '',
                                                district: value === '2-level' ? '' : prev.district,
                                                districtId: value === '2-level' ? 0 : prev.districtId
                                            }));
                                    },
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2 border rounded-md px-3 py-2 flex-1 cursor-pointer hover:bg-accent transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                    value: "2-level",
                                                    id: "level-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "level-2",
                                                    className: "cursor-pointer text-sm flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "2 cấp"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                            lineNumber: 401,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-muted-foreground block",
                                                            children: "Tỉnh → Phường/Xã"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 398,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2 border rounded-md px-3 py-2 flex-1 cursor-pointer hover:bg-accent transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                    value: "3-level",
                                                    id: "level-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "level-3",
                                                    className: "cursor-pointer text-sm flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "3 cấp"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-muted-foreground block",
                                                            children: "Tỉnh → Quận → Phường"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 405,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 383,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "label",
                                            className: "text-sm",
                                            children: "Tên địa chỉ *"
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 418,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            className: "h-9",
                                            id: "label",
                                            placeholder: "VD: Văn phòng chính, Nhà máy...",
                                            value: formData.label,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    label: e.target.value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 421,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 417,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "street",
                                            className: "text-sm",
                                            children: "Địa chỉ *"
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 431,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            className: "h-9",
                                            id: "street",
                                            placeholder: "Số nhà, tên đường...",
                                            value: formData.street,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    street: e.target.value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 434,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 430,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 416,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: addressLevel === '3-level' ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "province",
                                                className: "text-xs",
                                                children: "Tỉnh/TP *"
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                lineNumber: 448,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                                options: provinceOptions,
                                                value: provinceOptions.find((opt)=>opt.value === formData.province) || null,
                                                onChange: (option)=>{
                                                    const selectedProv = provinces.find((p)=>p.name === option?.value);
                                                    setFormData((prev)=>({
                                                            ...prev,
                                                            province: option ? option.value : '',
                                                            provinceId: selectedProv?.id || '',
                                                            district: '',
                                                            districtId: 0,
                                                            ward: '',
                                                            wardId: ''
                                                        }));
                                                },
                                                placeholder: "Chọn tỉnh/TP",
                                                searchPlaceholder: "Tìm tỉnh...",
                                                emptyPlaceholder: "Không tìm thấy.",
                                                estimatedItemHeight: 36
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                lineNumber: 451,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                        lineNumber: 447,
                                        columnNumber: 15
                                    }, this),
                                    addressLevel === '3-level' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "district",
                                                className: "text-xs",
                                                children: "Quận/Huyện *"
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                lineNumber: 476,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                                options: districtOptions,
                                                value: districtOptions.find((opt)=>opt.value === formData.district) || null,
                                                onChange: (option)=>{
                                                    const selectedDist = availableDistricts.find((d)=>d.name === option?.value);
                                                    setFormData((prev)=>({
                                                            ...prev,
                                                            district: option ? option.value : '',
                                                            districtId: selectedDist?.id || 0,
                                                            ward: '',
                                                            wardId: ''
                                                        }));
                                                },
                                                placeholder: selectedProvince ? 'Chọn quận/huyện' : 'Chọn tỉnh trước',
                                                searchPlaceholder: "Tìm quận/huyện...",
                                                emptyPlaceholder: "Không tìm thấy.",
                                                disabled: !selectedProvince,
                                                estimatedItemHeight: 36
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                lineNumber: 479,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                        lineNumber: 475,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "ward",
                                                className: "text-xs",
                                                children: "Phường/Xã"
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                lineNumber: 502,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                                options: wardOptions,
                                                value: wardOptions.find((opt)=>opt.value === formData.ward) || null,
                                                onChange: (option)=>{
                                                    const selectedWard = availableWards.find((w)=>w.name === option?.value);
                                                    setFormData((prev)=>({
                                                            ...prev,
                                                            ward: option ? option.value : '',
                                                            wardId: selectedWard?.id || '',
                                                            districtId: addressLevel === '3-level' ? selectedWard?.districtId || prev.districtId || 0 : prev.districtId
                                                        }));
                                                },
                                                placeholder: addressLevel === '3-level' && !formData.districtId ? 'Chọn quận/huyện trước' : selectedProvince ? 'Chọn phường/xã' : 'Chọn tỉnh trước',
                                                searchPlaceholder: "Tìm phường/xã...",
                                                emptyPlaceholder: "Không tìm thấy.",
                                                disabled: !selectedProvince || addressLevel === '3-level' && !formData.districtId,
                                                estimatedItemHeight: 36
                                            }, void 0, false, {
                                                fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                                lineNumber: 505,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                        lineNumber: 501,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                lineNumber: 446,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 445,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "contactName",
                                            className: "text-xs",
                                            children: "Người liên hệ"
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 538,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            className: "h-9",
                                            id: "contactName",
                                            placeholder: "Tên người liên hệ",
                                            value: formData.contactName,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    contactName: e.target.value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 541,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 537,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "contactPhone",
                                            className: "text-xs",
                                            children: "Số điện thoại"
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 550,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            className: "h-9",
                                            id: "contactPhone",
                                            placeholder: "Số điện thoại liên hệ",
                                            value: formData.contactPhone,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    contactPhone: e.target.value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 553,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 536,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "notes",
                                    className: "text-xs",
                                    children: "Ghi chú"
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 564,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    className: "h-9",
                                    id: "notes",
                                    placeholder: "Ghi chú thêm về địa chỉ này...",
                                    value: formData.notes,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            notes: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 567,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 563,
                            columnNumber: 11
                        }, this),
                        !hideDefaultSwitches && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 border-t pt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between space-x-2 p-3 border rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "isDefaultShipping",
                                            className: "font-normal text-sm flex-1 cursor-pointer",
                                            children: "Đặt làm mặc định giao hàng"
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 580,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                            id: "isDefaultShipping",
                                            checked: formData.isDefaultShipping,
                                            onCheckedChange: (checked)=>setFormData({
                                                    ...formData,
                                                    isDefaultShipping: checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 583,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 579,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between space-x-2 p-3 border rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "isDefaultBilling",
                                            className: "font-normal text-sm flex-1 cursor-pointer",
                                            children: "Đặt làm mặc định hóa đơn"
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 591,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                            id: "isDefaultBilling",
                                            checked: formData.isDefaultBilling,
                                            onCheckedChange: (checked)=>setFormData({
                                                    ...formData,
                                                    isDefaultBilling: checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                            lineNumber: 594,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                                    lineNumber: 590,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 578,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                    lineNumber: 379,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            className: "w-full sm:w-auto",
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 605,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleSave,
                            className: "w-full sm:w-auto",
                            children: editingAddress ? 'Cập nhật' : 'Thêm mới'
                        }, void 0, false, {
                            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                            lineNumber: 608,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/customers/components/address-form-dialog.tsx",
                    lineNumber: 604,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/customers/components/address-form-dialog.tsx",
            lineNumber: 369,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/customers/components/address-form-dialog.tsx",
        lineNumber: 368,
        columnNumber: 5
    }, this);
}
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
function getLastActivity(customer, slaType) {
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
"[project]/features/customers/sla/sla-sync.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer SLA Sync Utilities
 * NOTE: localStorage has been removed - uses in-memory cache + database sync
 */ __turbopack_context__.s([
    "addActivityLogAsync",
    ()=>addActivityLogAsync,
    "getAckMapSync",
    ()=>getAckMapSync,
    "getActivityLogSync",
    ()=>getActivityLogSync,
    "getEvaluationSync",
    ()=>getEvaluationSync,
    "initCustomerSlaData",
    ()=>initCustomerSlaData,
    "loadAckMapAsync",
    ()=>loadAckMapAsync,
    "loadActivityLogAsync",
    ()=>loadActivityLogAsync,
    "loadEvaluationAsync",
    ()=>loadEvaluationAsync,
    "saveAckMapAsync",
    ()=>saveAckMapAsync,
    "saveEvaluationAsync",
    ()=>saveEvaluationAsync
]);
// In-memory caches
let ackMapCache = null;
let activityLogCache = null;
let evaluationCache = null;
// ============= ACKNOWLEDGEMENTS =============
async function fetchAckMap() {
    try {
        const response = await fetch('/api/customer-sla?type=ack');
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('[CustomerSLA] Failed to fetch ack map:', error);
        throw error;
    }
}
async function saveAckMapToDb(map) {
    try {
        const response = await fetch('/api/customer-sla', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'ack',
                data: map
            })
        });
        if (!response.ok) throw new Error('Failed to save');
    } catch (error) {
        console.error('[CustomerSLA] Failed to save ack map:', error);
        throw error;
    }
}
async function loadAckMapAsync() {
    try {
        const data = await fetchAckMap();
        ackMapCache = data;
        return data;
    } catch  {
        return ackMapCache ?? {};
    }
}
function getAckMapSync() {
    return ackMapCache ?? {};
}
async function saveAckMapAsync(map) {
    await saveAckMapToDb(map);
    ackMapCache = map;
}
// ============= ACTIVITY LOG =============
async function fetchActivityLog() {
    try {
        const response = await fetch('/api/customer-sla?type=log');
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('[CustomerSLA] Failed to fetch activity log:', error);
        throw error;
    }
}
async function saveActivityLogToDb(logs) {
    try {
        const response = await fetch('/api/customer-sla', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'log',
                data: logs
            })
        });
        if (!response.ok) throw new Error('Failed to save');
    } catch (error) {
        console.error('[CustomerSLA] Failed to save activity log:', error);
        throw error;
    }
}
async function loadActivityLogAsync() {
    try {
        const data = await fetchActivityLog();
        activityLogCache = data;
        return data;
    } catch  {
        return activityLogCache ?? [];
    }
}
function getActivityLogSync() {
    return activityLogCache ?? [];
}
async function addActivityLogAsync(log) {
    const logs = getActivityLogSync();
    logs.push(log);
    // Keep only last 500 entries
    const trimmed = logs.slice(-500);
    await saveActivityLogToDb(trimmed);
    activityLogCache = trimmed;
}
// ============= EVALUATION DATA =============
async function fetchEvaluation() {
    try {
        const response = await fetch('/api/customer-sla?type=evaluation');
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('[CustomerSLA] Failed to fetch evaluation:', error);
        throw error;
    }
}
async function saveEvaluationToDb(data, timestamp) {
    try {
        await fetch('/api/customer-sla', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'evaluation',
                data
            })
        });
    } catch (error) {
        console.error('[CustomerSLA] Failed to save evaluation:', error);
        throw error;
    }
}
async function loadEvaluationAsync() {
    try {
        const data = await fetchEvaluation();
        evaluationCache = data;
        return data;
    } catch  {
        return evaluationCache;
    }
}
function getEvaluationSync() {
    return evaluationCache;
}
async function saveEvaluationAsync(data, timestamp) {
    await saveEvaluationToDb(data, timestamp);
    evaluationCache = data;
}
async function initCustomerSlaData() {
    await Promise.all([
        loadAckMapAsync(),
        loadActivityLogAsync(),
        loadEvaluationAsync()
    ]);
}
}),
"[project]/features/customers/sla/ack-storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer SLA Acknowledgement Storage
 * 
 * NOTE: localStorage has been removed - uses in-memory cache + database sync
 */ __turbopack_context__.s([
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
    "getSnoozeRemaining",
    ()=>getSnoozeRemaining,
    "isAlertSnoozed",
    ()=>isAlertSnoozed,
    "setAcknowledgement",
    ()=>setAcknowledgement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/sla-sync.ts [app-ssr] (ecmascript)");
;
// In-memory cache
let cachedMap = null;
let cachedActivityLog = null;
function ensureCache() {
    if (!cachedMap) {
        cachedMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAckMapSync"])();
    }
    return cachedMap;
}
function saveAckMap(map) {
    cachedMap = map;
    // Fire and forget - save to database in background
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveAckMapAsync"])(map).catch((error)=>{
        console.warn('[customer-sla] Failed to persist ack map to database', error);
    });
}
function getAcknowledgement(customerId, slaType) {
    const map = ensureCache();
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
    const map = ensureCache();
    map[customerId] = map[customerId] || {};
    map[customerId][ack.slaType] = ack;
    saveAckMap(map);
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
    const map = ensureCache();
    if (!map[customerId]) return;
    if (slaType) {
        delete map[customerId][slaType];
    } else {
        delete map[customerId];
    }
    saveAckMap(map);
}
// Activity Log functions
function loadActivityLog() {
    if (!cachedActivityLog) {
        cachedActivityLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getActivityLogSync"])();
    }
    return cachedActivityLog;
}
const SLA_LOG_UPDATED_EVENT = 'sla-log-updated';
function addActivityLog(log) {
    const logs = loadActivityLog();
    logs.push(log);
    // Keep only last 500 entries
    cachedActivityLog = logs.slice(-500);
    // Fire and forget - save to database in background
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addActivityLogAsync"])(log).catch((error)=>{
        console.warn('[customer-sla] Failed to save activity log to database', error);
    });
    // Dispatch event to notify listeners
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function getActivityLogs(customerId, limit = 50) {
    const logs = loadActivityLog();
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
 * NOTE: Now syncs with database via sla-sync.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/evaluator.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$ack$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/ack-storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/sla-sync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
// In-memory storage for last run time
let cachedLastRun = undefined;
const getPersistedIndex = ()=>{
    // Use sync utility which checks in-memory cache, then database
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEvaluationSync"])();
};
const getLastRun = ()=>{
    return cachedLastRun;
};
const persistedIndex = getPersistedIndex();
// Store reference for re-evaluation
let lastCustomers = [];
let lastSettings = [];
const useCustomerSlaEngineStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>{
    const initialState = {
        index: persistedIndex,
        summary: persistedIndex ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeIndex"])(persistedIndex) : null,
        isLoading: false
    };
    const initialLastRun = getLastRun();
    if (initialLastRun !== undefined) {
        initialState.lastEvaluatedAt = initialLastRun;
    }
    return {
        ...initialState,
        evaluate (customers, settings) {
            // Store for re-evaluation
            lastCustomers = customers;
            lastSettings = settings;
            set({
                isLoading: true
            });
            const nextIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSlaIndex"])(customers, settings);
            const nextSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$evaluator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeIndex"])(nextIndex);
            const timestamp = new Date().toISOString();
            // Update in-memory cache
            cachedLastRun = timestamp;
            // Fire and forget - save to database in background
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$sla$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveEvaluationAsync"])(nextIndex, timestamp).catch((error)=>{
                console.warn('[customer-sla] Failed to save evaluation to database', error);
            });
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
            if (freshCustomers.length && lastSettings.length) {
                get().evaluate(freshCustomers, lastSettings);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-ssr] (ecmascript)");
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
    const transactionsWithBalance = allTransactions.map((t)=>{
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
    const { data: allOrders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"])();
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
    const { data: allOrders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"])();
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
    const { data: allOrders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"])();
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
];

//# sourceMappingURL=features_customers_fe49f06b._.js.map