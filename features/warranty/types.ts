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
// Match Prisma enum: RECEIVED, PROCESSING, COMPLETED, RETURNED, CANCELLED
// ====================================
export const WARRANTY_STATUS_LABELS: Record<WarrantyStatus, string> = {
  RECEIVED: 'Đã tiếp nhận',
  PROCESSING: 'Đang xử lý',
  COMPLETED: 'Đã xử lý',
  RETURNED: 'Đã trả',
  CANCELLED: 'Đã hủy',
};

// Dùng design tokens (success/warning/info/destructive) thay palette thô để đồng bộ theme.
export const WARRANTY_STATUS_COLORS: Record<WarrantyStatus, string> = {
  RECEIVED: 'bg-warning/15 text-warning-foreground',
  PROCESSING: 'bg-info/15 text-info-foreground',
  COMPLETED: 'bg-success/15 text-success-foreground',
  RETURNED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-destructive/15 text-destructive line-through',
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
  pending: 'bg-destructive/15 text-destructive',
  partial: 'bg-warning/15 text-warning-foreground',
  completed: 'bg-success/15 text-success-foreground',
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
// Match Prisma enum: RECEIVED, PROCESSING, COMPLETED, RETURNED, CANCELLED
// ====================================
export const WARRANTY_STATUS_TRANSITIONS: Record<WarrantyStatus, WarrantyStatus[]> = {
  RECEIVED: ['PROCESSING'],      // Đã tiếp nhận → Đang xử lý
  PROCESSING: ['COMPLETED'],     // Đang xử lý → Đã xử lý
  COMPLETED: ['RETURNED'],       // Đã xử lý → Đã trả
  RETURNED: [],                  // Đã trả → Final state (có thể quay lại COMPLETED)
  CANCELLED: [],                 // Đã hủy → Final state
};

export const WARRANTY_STATUS_TRANSITION_LABELS: Partial<Record<WarrantyStatus, Partial<Record<WarrantyStatus, string>>>> = {
  RECEIVED: {
    PROCESSING: 'Bắt đầu xử lý',
  },
  PROCESSING: {
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
