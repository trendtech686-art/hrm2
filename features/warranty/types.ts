/**
 * Warranty Management Types & Constants
 * 
 * Types are re-exported from @/lib/types/prisma-extended
 * Constants (labels, colors, transitions) are defined here
 */

// Re-export types from prisma-extended
export type {
  WarrantyStatus,
  WarrantySettlementStatus,
  ResolutionType,
  SettlementType,
  SettlementStatus,
  SettlementMethod,
  WarrantySettlement,
  WarrantyProduct,
  WarrantyHistory,
  WarrantyComment,
  WarrantyTicket,
  WarrantyFormValues,
  UnsettledProduct,
} from '@/lib/types/prisma-extended';

// Re-export local UI types
export type {
  WarrantyCustomerInfo,
  WarrantyBranchContext,
  WarrantyVoucherDialogBaseProps,
} from './types/ui';

// Import types for use in constants
import type { 
  WarrantyStatus, 
  WarrantySettlementStatus, 
  ResolutionType, 
  SettlementType, 
  SettlementStatus 
} from '@/lib/types/prisma-extended';

// ====================================
// WARRANTY STATUS - Labels & Colors
// Match Prisma enum: RECEIVED, PROCESSING, WAITING_PARTS, COMPLETED, RETURNED, CANCELLED
// ====================================
export const WARRANTY_STATUS_LABELS: Record<WarrantyStatus, string> = {
  RECEIVED: 'Đã tiếp nhận',
  PROCESSING: 'Đang xử lý',
  WAITING_PARTS: 'Chờ linh kiện',
  COMPLETED: 'Hoàn tất',
  RETURNED: 'Đã trả',
  CANCELLED: 'Đã hủy',
};

export const WARRANTY_STATUS_COLORS: Record<WarrantyStatus, string> = {
  RECEIVED: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  WAITING_PARTS: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  RETURNED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800 line-through',
};

// ====================================
// WARRANTY SETTLEMENT STATUS - Labels & Colors
// ====================================
export const WARRANTY_SETTLEMENT_STATUS_LABELS: Record<WarrantySettlementStatus, string> = {
  pending: 'Chưa thanh toán',
  partial: 'Thanh toán một phần',
  completed: 'Đã thanh toán',
};

export const WARRANTY_SETTLEMENT_STATUS_COLORS: Record<WarrantySettlementStatus, string> = {
  pending: 'bg-red-100 text-red-800',
  partial: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
};

// ====================================
// RESOLUTION TYPE - Labels
// ====================================
export const RESOLUTION_LABELS: Record<ResolutionType, string> = {
  return: 'Trả lại',
  replace: 'Đổi mới',
  deduct: 'Trừ tiền',
  out_of_stock: 'Hết hàng',
};

// ====================================
// SETTLEMENT TYPE - Labels
// ====================================
export const SETTLEMENT_TYPE_LABELS: Record<SettlementType, string> = {
  cash: 'Trả tiền mặt',
  transfer: 'Chuyển khoản',
  debt: 'Ghi công nợ',
  voucher: 'Tạo voucher',
  order_deduction: 'Trừ vào tiền hàng',
  mixed: 'Kết hợp nhiều phương thức',
};

// ====================================
// SETTLEMENT STATUS - Labels
// ====================================
export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  pending: 'Chưa bù trừ',
  partial: 'Bù trừ 1 phần',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
};

// ====================================
// STATUS WORKFLOW RULES
// Match Prisma enum: RECEIVED, PROCESSING, WAITING_PARTS, COMPLETED, RETURNED, CANCELLED
// ====================================
export const WARRANTY_STATUS_TRANSITIONS: Record<WarrantyStatus, WarrantyStatus[]> = {
  RECEIVED: ['PROCESSING'],      // Đã tiếp nhận → Đang xử lý
  PROCESSING: ['WAITING_PARTS', 'COMPLETED'],  // Đang xử lý → Chờ linh kiện hoặc Hoàn tất
  WAITING_PARTS: ['PROCESSING', 'COMPLETED'],  // Chờ linh kiện → Đang xử lý hoặc Hoàn tất
  COMPLETED: ['RETURNED'],       // Hoàn tất → Đã trả
  RETURNED: [],                  // Đã trả → Final state
  CANCELLED: [],                 // Đã hủy → Final state
};

export const WARRANTY_STATUS_TRANSITION_LABELS: Partial<Record<WarrantyStatus, Partial<Record<WarrantyStatus, string>>>> = {
  RECEIVED: {
    PROCESSING: 'Bắt đầu xử lý',
  },
  PROCESSING: {
    WAITING_PARTS: 'Chờ linh kiện',
    COMPLETED: 'Hoàn thành xử lý',
  },
  WAITING_PARTS: {
    PROCESSING: 'Tiếp tục xử lý',
    COMPLETED: 'Hoàn thành xử lý',
  },
  COMPLETED: {
    RETURNED: 'Trả hàng cho khách',
  },
  RETURNED: {},
  CANCELLED: {},
};

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Check if status transition is allowed
 */
export function canTransitionStatus(currentStatus: WarrantyStatus, newStatus: WarrantyStatus): boolean {
  return WARRANTY_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

/**
 * Get next allowed statuses from current status
 */
export function getNextAllowedStatuses(currentStatus: WarrantyStatus): WarrantyStatus[] {
  return WARRANTY_STATUS_TRANSITIONS[currentStatus];
}
