/**
 * Order Error Messages - Vietnamese error messages for order operations
 * 
 * Provides consistent Vietnamese error messages across all order APIs.
 * 
 * @example
 * import { orderErrors } from '@/lib/constants/order-error-messages';
 * return apiError(orderErrors.ORDER_NOT_FOUND, 404);
 */

// ========================================
// GENERAL ERRORS
// ========================================
export const orderErrors = {
  // Authentication
  UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
  
  // Not Found
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
  CUSTOMER_NOT_FOUND: 'Không tìm thấy khách hàng',
  PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm',
  BRANCH_NOT_FOUND: 'Không tìm thấy chi nhánh',
  EMPLOYEE_NOT_FOUND: 'Không tìm thấy nhân viên',
  PACKAGING_NOT_FOUND: 'Không tìm thấy phiếu đóng gói',
  SHIPMENT_NOT_FOUND: 'Không tìm thấy vận đơn',
  PAYMENT_NOT_FOUND: 'Không tìm thấy thanh toán',
  
  // Validation
  CUSTOMER_REQUIRED: 'Vui lòng chọn khách hàng',
  BRANCH_REQUIRED: 'Vui lòng chọn chi nhánh',
  SALESPERSON_REQUIRED: 'Vui lòng chọn nhân viên bán hàng',
  LINE_ITEMS_REQUIRED: 'Đơn hàng phải có ít nhất 1 sản phẩm',
  PRODUCT_REFERENCE_MISSING: 'Sản phẩm dòng #{index} thiếu mã sản phẩm',
  STATUS_REQUIRED: 'Vui lòng chọn trạng thái',
  AMOUNT_REQUIRED: 'Vui lòng nhập số tiền',
  AMOUNT_INVALID: 'Số tiền không hợp lệ',
  
  // Status Transitions
  INVALID_STATUS_TRANSITION: 'Không thể chuyển từ trạng thái "{from}" sang "{to}"',
  CANNOT_CANCEL_DELIVERED: 'Không thể hủy đơn hàng đã giao',
  CANNOT_CANCEL_COMPLETED: 'Không thể hủy đơn hàng đã hoàn thành',
  CANNOT_CANCEL_CANCELLED: 'Đơn hàng đã được hủy trước đó',
  CANNOT_CANCEL_RETURNED: 'Không thể hủy đơn hàng đã hoàn trả',
  
  // Packaging
  ORDER_NOT_CONFIRMED: 'Đơn hàng chưa được xác nhận',
  PACKAGING_ALREADY_COMPLETED: 'Phiếu đóng gói đã hoàn thành',
  PACKAGING_ALREADY_CANCELLED: 'Phiếu đóng gói đã bị hủy',
  CANNOT_DISPATCH_INCOMPLETE: 'Không thể gửi hàng khi chưa đóng gói xong',
  
  // Delivery
  NOT_IN_SHIPPING_STATE: 'Đơn hàng không trong trạng thái đang giao',
  ALREADY_DELIVERED: 'Đơn hàng đã được giao',
  
  // Payment
  PAYMENT_EXCEEDS_TOTAL: 'Số tiền thanh toán vượt quá tổng đơn hàng',
  PAYMENT_ALREADY_FULL: 'Đơn hàng đã thanh toán đầy đủ',
  
  // GHTK
  GHTK_CONNECTION_ERROR: 'Không thể kết nối với GHTK. Vui lòng thử lại sau',
  GHTK_CREATE_FAILED: 'Tạo vận đơn GHTK thất bại',
  GHTK_CANCEL_FAILED: 'Hủy vận đơn GHTK thất bại',
  GHTK_NOT_CONFIGURED: 'Chưa cấu hình kết nối GHTK',
  
  // Generic
  INVALID_JSON: 'Dữ liệu không hợp lệ',
  INTERNAL_ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại sau',
  ID_GENERATION_FAILED: 'Không thể tạo mã đơn hàng. Vui lòng thử lại',
  DUPLICATE_ORDER: 'Đơn hàng đã tồn tại',
};

// ========================================
// SUCCESS MESSAGES
// ========================================
export const orderSuccess = {
  ORDER_CREATED: 'Tạo đơn hàng thành công',
  ORDER_UPDATED: 'Cập nhật đơn hàng thành công',
  ORDER_CANCELLED: 'Hủy đơn hàng thành công',
  ORDER_CONFIRMED: 'Xác nhận đơn hàng thành công',
  ORDER_COMPLETED: 'Hoàn thành đơn hàng thành công',
  
  PACKAGING_CREATED: 'Tạo phiếu đóng gói thành công',
  PACKAGING_CONFIRMED: 'Xác nhận đóng gói thành công',
  PACKAGING_CANCELLED: 'Hủy đóng gói thành công',
  
  SHIPMENT_CREATED: 'Tạo vận đơn thành công',
  SHIPMENT_DISPATCHED: 'Gửi hàng thành công',
  DELIVERY_COMPLETED: 'Xác nhận giao hàng thành công',
  DELIVERY_FAILED: 'Đã ghi nhận giao hàng thất bại',
  
  PAYMENT_ADDED: 'Ghi nhận thanh toán thành công',
  PAYMENT_DELETED: 'Xóa thanh toán thành công',
  
  GHTK_CREATED: 'Tạo vận đơn GHTK thành công',
  GHTK_CANCELLED: 'Hủy vận đơn GHTK thành công',
  GHTK_SYNCED: 'Đồng bộ trạng thái GHTK thành công',
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Format error message with dynamic values
 * @example
 * formatError(orderErrors.INVALID_STATUS_TRANSITION, { from: 'PENDING', to: 'DELIVERED' })
 * // Returns: "Không thể chuyển từ trạng thái "PENDING" sang "DELIVERED""
 */
export function formatError(message: string, params: Record<string, string | number>): string {
  let result = message;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, String(value));
  });
  return result;
}

/**
 * Get product not found error with product ID
 */
export function productNotFoundError(productId: string): string {
  return `Không tìm thấy sản phẩm: ${productId}`;
}

/**
 * Get line item error with index
 */
export function lineItemError(index: number, message: string): string {
  return `Dòng ${index + 1}: ${message}`;
}
