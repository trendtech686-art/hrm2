module.exports = [
"[project]/hooks/use-workflow-templates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearWorkflowTemplatesCache",
    ()=>clearWorkflowTemplatesCache,
    "fetchWorkflowTemplates",
    ()=>fetchWorkflowTemplates,
    "getWorkflowTemplateSubtasks",
    ()=>getWorkflowTemplateSubtasks,
    "getWorkflowTemplateSync",
    ()=>getWorkflowTemplateSync,
    "getWorkflowTemplatesByType",
    ()=>getWorkflowTemplatesByType,
    "getWorkflowTemplatesSync",
    ()=>getWorkflowTemplatesSync,
    "useWorkflowTemplates",
    ()=>useWorkflowTemplates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.js [app-ssr] (ecmascript) <locals>");
;
;
// Default templates for initial setup
function getDefaultTemplates() {
    const now = new Date();
    return [
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'complaints',
            label: 'Quy trình Khiếu nại tiêu chuẩn',
            description: 'Các bước xử lý khiếu nại từ khách hàng',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tiếp nhận và ghi nhận',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phân loại và đánh giá',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xác minh thông tin',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đề xuất giải pháp',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thực hiện xử lý',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phản hồi khách hàng',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đánh giá kết quả',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'warranty',
            label: 'Quy trình Bảo hành tiêu chuẩn',
            description: 'Các bước xử lý bảo hành sản phẩm',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tiếp nhận yêu cầu',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra điều kiện BH',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra lỗi sản phẩm',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Báo giá sửa chữa',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thực hiện sửa chữa',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra chất lượng',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Trả hàng khách',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'orders',
            label: 'Quy trình Đơn hàng tiêu chuẩn',
            description: 'Các bước xử lý đơn hàng',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xác nhận đơn hàng',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra tồn kho',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Chuẩn bị hàng hóa',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đóng gói',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Giao hàng',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thu tiền',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Hoàn tất',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'sales-returns',
            label: 'Quy trình Đổi trả hàng',
            description: 'Các bước xử lý đổi trả hàng bán',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tiếp nhận yêu cầu',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra điều kiện',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra sản phẩm',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xử lý hoàn tiền/đổi hàng',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Cập nhật kho',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Hoàn tất',
                    completed: false,
                    order: 5,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'purchase-returns',
            label: 'Quy trình Trả hàng NCC',
            description: 'Các bước trả hàng cho nhà cung cấp',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phát hiện sản phẩm lỗi/hỏng',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tạo phiếu trả hàng',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Liên hệ NCC',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đóng gói trả hàng',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Gửi hàng trả',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Nhận hoàn tiền/đổi hàng',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Cập nhật kho',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'stock-transfers',
            label: 'Quy trình Chuyển kho',
            description: 'Các bước chuyển hàng giữa các kho',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tạo phiếu chuyển kho',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra tồn kho xuất',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Lấy hàng và kiểm đếm',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đóng gói và ghi chú vận chuyển',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xuất kho nguồn',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Vận chuyển đến kho đích',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Nhận hàng và kiểm đếm tại kho đích',
                    completed: false,
                    order: 6,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Nhập kho đích và hoàn tất',
                    completed: false,
                    order: 7,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'inventory-checks',
            label: 'Quy trình Kiểm kho',
            description: 'Các bước thực hiện kiểm kê hàng tồn kho',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Lên kế hoạch kiểm kho (thời gian, phạm vi)',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'In danh sách hàng hóa cần kiểm',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phân công nhân sự kiểm kê',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thực hiện kiểm đếm thực tế',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Ghi nhận số lượng thực tế',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đối chiếu với số liệu hệ thống',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xác định và giải trình chênh lệch',
                    completed: false,
                    order: 6,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Duyệt và cập nhật tồn kho',
                    completed: false,
                    order: 7,
                    createdAt: now
                }
            ]
        }
    ];
}
// Parse templates from API response
function parseTemplates(data) {
    return data.map((t)=>({
            ...t,
            systemId: t.systemId || t.id,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
            subtasks: t.subtasks.map((s)=>({
                    ...s,
                    createdAt: new Date(s.createdAt),
                    completedAt: s.completedAt ? new Date(s.completedAt) : undefined
                }))
        }));
}
// In-memory cache for templates (shared across components)
let templatesCache = null;
let cachePromise = null;
async function fetchWorkflowTemplates() {
    // Return cached if available
    if (templatesCache) {
        return templatesCache;
    }
    // Prevent multiple simultaneous fetches
    if (cachePromise) {
        return cachePromise;
    }
    cachePromise = (async ()=>{
        try {
            const res = await fetch('/api/workflow-templates');
            if (res.ok) {
                const json = await res.json();
                if (json.data && json.data.length > 0) {
                    templatesCache = parseTemplates(json.data);
                    return templatesCache;
                }
            }
        } catch (error) {
            console.error('Failed to fetch workflow templates from API:', error);
        }
        // Return default templates if API fails
        templatesCache = getDefaultTemplates();
        return templatesCache;
    })();
    const result = await cachePromise;
    cachePromise = null;
    return result;
}
async function getWorkflowTemplateSubtasks(workflowName) {
    const templates = await fetchWorkflowTemplates();
    // Find default template for this workflow
    const template = templates.find((t)=>t.name === workflowName && t.isDefault);
    if (!template) {
        // Fallback: get first template for this workflow
        const fallback = templates.find((t)=>t.name === workflowName);
        if (!fallback) return [];
        return fallback.subtasks.map((s)=>({
                ...s,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                completed: false,
                completedAt: undefined
            }));
    }
    // Deep clone and reset completed status
    return template.subtasks.map((s)=>({
            ...s,
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            completed: false,
            completedAt: undefined
        }));
}
async function getWorkflowTemplatesByType(workflowName) {
    const templates = await fetchWorkflowTemplates();
    return templates.filter((t)=>t.name === workflowName);
}
function clearWorkflowTemplatesCache() {
    templatesCache = null;
    cachePromise = null;
}
function useWorkflowTemplates() {
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const isSavingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Load templates on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        const load = async ()=>{
            try {
                const data = await fetchWorkflowTemplates();
                if (mounted) {
                    setTemplates(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError('Failed to load templates');
                    // Use default templates on error
                    setTemplates(getDefaultTemplates());
                }
            } finally{
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };
        load();
        return ()=>{
            mounted = false;
        };
    }, []);
    // Save templates to database
    const saveTemplates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (newTemplates)=>{
        if (isSavingRef.current) return;
        isSavingRef.current = true;
        setTemplates(newTemplates);
        try {
            const res = await fetch('/api/workflow-templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    templates: newTemplates
                })
            });
            if (!res.ok) {
                throw new Error('Failed to save templates');
            }
            // Clear cache so next fetch gets fresh data
            clearWorkflowTemplatesCache();
            templatesCache = newTemplates;
            setError(null);
        } catch (err) {
            console.error('Error saving templates:', err);
            setError('Failed to save templates');
        } finally{
            isSavingRef.current = false;
        }
    }, []);
    return {
        templates,
        setTemplates: saveTemplates,
        isLoading,
        error
    };
}
function getWorkflowTemplatesSync() {
    if (templatesCache) {
        return templatesCache;
    }
    // Return default templates if cache not loaded
    return getDefaultTemplates();
}
function getWorkflowTemplateSync(workflowName) {
    const templates = getWorkflowTemplatesSync();
    const template = templates.find((t)=>t.name === workflowName && t.isDefault);
    if (!template) {
        const fallback = templates.find((t)=>t.name === workflowName);
        if (!fallback) return [];
        return fallback.subtasks.map((s)=>({
                ...s,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                completed: false,
                completedAt: undefined
            }));
    }
    return template.subtasks.map((s)=>({
            ...s,
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            completed: false,
            completedAt: undefined
        }));
}
}),
"[project]/hooks/use-workflow-templates.ts [app-ssr] (ecmascript) <export getWorkflowTemplateSync as getWorkflowTemplate>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWorkflowTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWorkflowTemplateSync"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-workflow-templates.ts [app-ssr] (ecmascript)");
}),
"[project]/hooks/use-debounce.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](value);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        }, delay);
        return ()=>{
            clearTimeout(handler);
        };
    }, [
        value,
        delay
    ]);
    return debouncedValue;
}
}),
"[project]/repositories/in-memory-repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/app/(authenticated)/warranty/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$list$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/warranty-list-page.tsx [app-ssr] (ecmascript)");
"use client";
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$list$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WarrantyListPage"];
}),
];

//# sourceMappingURL=_30dc3921._.js.map