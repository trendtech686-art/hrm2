/**
 * Print Mappers - Index
 * Export tất cả mappers từ một nơi
 */

// Types & Utilities
export * from './types';

// =============================================
// MAIN TEMPLATE TYPES (16 loại chính)
// =============================================

// Order - Đơn bán hàng
export * from './order.mapper';

// Quote - Báo giá / Đơn tạm tính
export * from './quote.mapper';

// Sales Return - Đơn đổi trả hàng
export * from './sales-return.mapper';

// Packing - Phiếu đóng gói
export * from './packing.mapper';

// Delivery - Phiếu giao hàng
export * from './delivery.mapper';

// Shipping Label - Nhãn giao hàng
export * from './shipping-label.mapper';

// Product Label - Tem phụ sản phẩm
export * from './product-label.mapper';

// Purchase Order - Đơn đặt hàng nhập
export * from './purchase-order.mapper';

// Stock In - Phiếu nhập kho
export * from './stock-in.mapper';

// Stock Transfer - Phiếu chuyển kho
export * from './stock-transfer.mapper';

// Inventory Check - Phiếu kiểm kho
export * from './inventory-check.mapper';

// Receipt - Phiếu thu
export * from './receipt.mapper';

// Payment - Phiếu chi
export * from './payment.mapper';

// Warranty - Phiếu bảo hành
export * from './warranty.mapper';

// Supplier Return - Phiếu trả hàng NCC
export * from './supplier-return.mapper';

// Complaint - Phiếu khiếu nại
export * from './complaint.mapper';

// Penalty - Phiếu phạt
export * from './penalty.mapper';

// =============================================
// EXTENDED TEMPLATE TYPES (8 loại mở rộng)
// =============================================

// Supplier Order - Đơn đặt hàng nhập (don-dat-hang-nhap)
export * from './supplier-order.mapper';

// Return Order - Đơn trả hàng (don-tra-hang)
export * from './return-order.mapper';

// Handover - Phiếu bàn giao (phieu-ban-giao)
export * from './handover.mapper';

// Refund Confirmation - Phiếu xác nhận hoàn (phieu-xac-nhan-hoan)
export * from './refund-confirmation.mapper';

// Packing Guide - Phiếu hướng dẫn đóng gói (phieu-huong-dan-dong-goi)
export * from './packing-guide.mapper';

// Sales Summary - Phiếu tổng kết bán hàng (phieu-tong-ket-ban-hang)
export * from './sales-summary.mapper';

// Warranty Request - Phiếu yêu cầu bảo hành (phieu-yeu-cau-bao-hanh)
export * from './warranty-request.mapper';

// Packing Request - Phiếu yêu cầu đóng gói (phieu-yeu-cau-dong-goi)
export * from './packing-request.mapper';
