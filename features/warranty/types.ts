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
export type { WarrantyStore } from './types/store';

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
// ====================================
export const WARRANTY_STATUS_LABELS: Record<WarrantyStatus, string> = {
  incomplete: 'Chưa đầy đủ',
  pending: 'Chưa xử lý',
  processed: 'Đã xử lý',
  returned: 'Đã trả',
  completed: 'Kết thúc',
  cancelled: 'Đã hủy',
};

export const WARRANTY_STATUS_COLORS: Record<WarrantyStatus, string> = {
  incomplete: 'bg-orange-100 text-orange-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processed: 'bg-green-100 text-green-800',
  returned: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800 line-through',
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
// ====================================
export const WARRANTY_STATUS_TRANSITIONS: Record<WarrantyStatus, WarrantyStatus[]> = {
  incomplete: ['pending'],    // Chưa đầy đủ → Chưa xử lý
  pending: ['processed'],     // Chưa xử lý → Đã xử lý
  processed: ['returned'],    // Đã xử lý → Đã trả
  returned: ['completed'],    // Đã trả → Kết thúc (sau khi thanh toán đầy đủ)
  completed: [],              // Kết thúc → Final state
  cancelled: [],              // Đã hủy → Final state
};

export const WARRANTY_STATUS_TRANSITION_LABELS: Partial<Record<WarrantyStatus, Partial<Record<WarrantyStatus, string>>>> = {
  incomplete: {
    pending: 'Bắt đầu xử lý',
  },
  pending: {
    processed: 'Hoàn thành xử lý',
  },
  processed: {
    returned: 'Trả hàng cho khách',
  },
  returned: {
    completed: 'Kết thúc phiếu bảo hành',
  },
  completed: {},
  cancelled: {},
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
