/**
 * TOAST MESSAGES CONSTANTS
 * Tất cả toast messages trong complaints module - đầy đủ tiếng Việt có dấu
 */

export const COMPLAINT_TOAST_MESSAGES = {
  // Success messages
  SUCCESS: {
    CREATED: 'Đã tạo khiếu nại thành công',
    UPDATED: 'Đã cập nhật khiếu nại',
    STATUS_UPDATED: 'Đã cập nhật trạng thái',
    ENDED: 'Đã kết thúc khiếu nại thành công',
    REOPENED: 'Đã mở lại khiếu nại thành công',
    CANCELLED: 'Đã hủy khiếu nại',
    REJECTED: 'Đã từ chối khiếu nại thành công',
    PROCESSING_STARTED: 'Đã bắt đầu xử lý khiếu nại',
    VERIFIED_CORRECT: 'Đã xác nhận khiếu nại đúng',
    VERIFIED_INCORRECT: 'Đã xác nhận khiếu nại sai',
    COMPENSATION_CREATED: 'Đã xác nhận khiếu nại đúng và tạo phiếu bù trừ',
    INVENTORY_ADJUSTED: (count: number) => `Đã điều chỉnh kho cho ${count} sản phẩm`,
    WORKFLOW_COMPLETED: 'Hoàn thành toàn bộ quy trình! Khiếu nại đã được giải quyết.',
    WORKFLOW_TASK_TOGGLED: (action: string, title: string) => `${action}: ${title}`,
    WORKFLOW_STATUS_CHANGED: (statusLabel: string) => `Tự động chuyển sang: ${statusLabel}`,
    DATA_REFRESHED: 'Đã làm mới dữ liệu',
    IMAGES_SAVED: (count: number) => `Đã lưu ${count} hình ảnh mới`,
    EMPLOYEE_IMAGES_SAVED: (count: number) => `Đã lưu ${count} hình ảnh nhân viên`,
    
    // Bulk actions
    BULK_ENDED: (count: number) => `Đã kết thúc ${count} khiếu nại`,
    BULK_REOPENED: (count: number) => `Đã mở lại ${count} khiếu nại`,
    BULK_CANCELLED: (count: number) => `Đã hủy ${count} khiếu nại`,
    BULK_TRACKING_COPIED: (count: number) => `Đã copy ${count} link tracking vào clipboard`,
  },

  // Error messages
  ERROR: {
    NOT_FOUND: 'Không tìm thấy khiếu nại',
    ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
    EMPLOYEE_NOT_FOUND: 'Không tìm thấy thông tin nhân viên',
    CANNOT_END: 'Không thể kết thúc khiếu nại',
    CANNOT_REOPEN: 'Không thể mở lại khiếu nại',
    CANNOT_CANCEL: 'Không thể hủy khiếu nại',
    CANNOT_REJECT: 'Không thể từ chối khiếu nại',
    CANNOT_START_PROCESSING: 'Không thể bắt đầu xử lý khiếu nại',
    CANNOT_COPY_TRACKING: 'Không thể copy link tracking',
    GENERIC: 'Có lỗi xảy ra',
    SAVE_EVIDENCE_FAILED: 'Có lỗi xảy ra khi lưu bằng chứng',
    CREATE_PAYMENT_FAILED: 'Có lỗi khi tạo phiếu chi',
    
    // Validation errors
    NO_SELECTION: 'Vui lòng chọn ít nhất một khiếu nại',
    MUST_VERIFY_FIRST: 'Vui lòng xác minh khiếu nại (đúng/sai) trước khi thực hiện quy trình xử lý',
    MUST_VERIFY_BEFORE_END: 'Vui lòng xác minh khiếu nại trước khi kết thúc',
    MUST_VERIFY_BEFORE_COMPENSATION: 'Vui lòng xác nhận khiếu nại đúng trước khi xử lý bù trừ',
    EVIDENCE_REQUIRED: 'Vui lòng tải lên file bằng chứng hoặc dán link video hoặc ghi chú',
    INVENTORY_ADJUSTMENT_REQUIRED: 'Vui lòng nhập số lượng điều chỉnh cho ít nhất 1 sản phẩm',
    INVENTORY_REASON_REQUIRED: 'Vui lòng nhập lý do điều chỉnh kho',
    
    // Permission errors
    NO_ASSIGN_PERMISSION: 'Bạn không có quyền gán khiếu nại',
    
    // Settings errors
    PAYMENT_TYPE_NOT_FOUND: "Không tìm thấy loại phiếu chi 'Bù trừ khiếu nại'. Vui lòng tạo trong cài đặt.",
    RECEIPT_TYPE_NOT_FOUND: "Không tìm thấy loại phiếu thu 'Chi phí phát sinh'. Vui lòng tạo trong cài đặt.",
    TRACKING_DISABLED: 'Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.',
  },

  // Info messages
  INFO: {
    NEW_UPDATE_AVAILABLE: 'Có cập nhật mới từ hệ thống',
  },
} as const;
