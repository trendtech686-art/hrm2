/**
 * Warranty Processing Logic
 * Tách riêng logic điều kiện hiển thị cho dễ quản lý và debug
 */

import type { WarrantyTicket } from '../types.ts';
import type { Payment } from '../../payments/types.ts';
import type { Receipt } from '../../receipts/types.ts';

// ============================================================
// TYPES
// ============================================================

export interface WarrantyProcessingState {
  // Input data
  ticket: WarrantyTicket | null;
  payments: Payment[];
  receipts: Receipt[];
  totalPayment: number;
  
  // Computed state
  warrantyPayments: Payment[];
  warrantyReceipts: Receipt[];
  totalPaid: number;
  remainingAmount: number;
  hasTransactions: boolean;
  allTransactionsCancelled: boolean;
  
  // Display flags
  shouldHideCard: boolean;
  canShowActionButtons: boolean;
  canShowPaymentButton: boolean;
  canShowReceiptButton: boolean;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Lấy phiếu chi liên quan đến warranty này (loại bỏ phiếu đã hủy)
 */
export function getWarrantyPayments(
  payments: Payment[], 
  warrantySystemId: string
): Payment[] {
  return payments
    .filter(p => p.linkedWarrantySystemId === warrantySystemId && p.status !== 'cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Lấy phiếu thu liên quan đến warranty này (loại bỏ phiếu đã hủy)
 */
export function getWarrantyReceipts(
  receipts: Receipt[], 
  warrantySystemId: string
): Receipt[] {
  return receipts
    .filter(r => (r as any).linkedWarrantySystemId === warrantySystemId && r.status !== 'cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Tính tổng tiền đã thanh toán (chỉ tính phiếu chưa hủy)
 * Returns: { totalPayments, totalReceipts }
 */
export function calculateTotalPaid(
  payments: Payment[], 
  receipts: Receipt[]
): { totalPayments: number; totalReceipts: number } {
  const totalPayments = payments
    .filter(p => p.status !== 'cancelled')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalReceipts = receipts
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.amount, 0);
    
  return { totalPayments, totalReceipts };
}

/**
 * Kiểm tra có phiếu thu/chi nào không
 */
export function hasAnyTransactions(
  payments: Payment[], 
  receipts: Receipt[]
): boolean {
  return payments.length > 0 || receipts.length > 0;
}

/**
 * Kiểm tra tất cả phiếu đã bị hủy không
 */
export function areAllTransactionsCancelled(
  payments: Payment[], 
  receipts: Receipt[]
): boolean {
  const allTransactions = [...payments, ...receipts];
  return allTransactions.length > 0 && allTransactions.every(t => t.status === 'cancelled');
}

// ============================================================
// MAIN LOGIC - ĐIỀU KIỆN HIỂN THỊ
// ============================================================

/**
 * ✅ 1. Điều kiện ẨN CARD hoàn toàn
 * 
 * Ẩn card khi:
 * - Chưa có phiếu thu/chi nào
 * - VÀ (Phiếu đang ở giai đoạn đầu HOẶC đã bị hủy)
 * 
 * → Card chỉ xuất hiện khi đã có transaction hoặc đã đến giai đoạn xử lý
 */
export function shouldHideCard(
  ticket: WarrantyTicket | null,
  hasTransactions: boolean
): boolean {
  if (!ticket) return true;
  
  // Ẩn card nếu chưa có transaction VÀ chưa đến giai đoạn xử lý
  return !hasTransactions && 
         (ticket.status === 'incomplete' || 
          ticket.status === 'pending' || 
          !!ticket.cancelledAt);
}

/**
 * ✅ 2. Điều kiện HIỆN NÚT tạo phiếu chi/thu
 * 
 * Hiện nút khi:
 * - Phiếu KHÔNG bị hủy
 * - Có tiền cần xử lý (totalPayment !== 0)
 * - Còn tiền chưa thanh toán (remainingAmount > 0) ← ✅ THÊM
 * - VÀ một trong các trường hợp sau:
 *   1. Đã đến giai đoạn xử lý (processed/returned/completed)
 *   2. Đã có phiếu thanh toán (cho phép thanh toán nhiều lần)
 * 
 * → Logic: Miễn còn tiền chưa trả + phiếu chưa hủy + (đã xử lý HOẶC đã có phiếu)
 */
export function canShowActionButtons(
  ticket: WarrantyTicket | null,
  totalPayment: number,
  remainingAmount: number,
  hasTransactions: boolean,
  allTransactionsCancelled: boolean
): boolean {
  if (!ticket) return false;
  
  // Điều kiện cơ bản
  const notCancelled = !ticket.cancelledAt;
  const hasPaymentNeeded = totalPayment !== 0;
  const hasRemainingAmount = remainingAmount > 0; // ✅ THÊM: Còn tiền chưa trả
  
  // Các trường hợp cho phép hiện nút
  const isInProcessingStage = ticket.status === 'processed' || 
                              ticket.status === 'returned' || 
                              ticket.status === 'completed';
  
  const hasExistingTransactions = hasTransactions; // Đã có phiếu → cho phép tạo thêm
  
  return notCancelled && 
         hasPaymentNeeded && 
         hasRemainingAmount &&  // ✅ CHỈ HIỆN KHI CÒN TIỀN CHƯA TRẢ
         (isInProcessingStage || hasExistingTransactions);
}

/**
 * ✅ 3. Điều kiện HIỆN NÚT TẠO PHIẾU CHI
 * 
 * Hiện khi:
 * - canShowActionButtons = true
 * - totalPayment > 0 (cần trả tiền cho khách)
 */
export function canShowPaymentButton(
  canShowActions: boolean,
  totalPayment: number
): boolean {
  return canShowActions && totalPayment > 0;
}

/**
 * ✅ 4. Điều kiện HIỆN NÚT TẠO PHIẾU THU
 * 
 * Hiện khi:
 * - canShowActionButtons = true
 * - totalPayment < 0 (cần thu tiền từ khách)
 */
export function canShowReceiptButton(
  canShowActions: boolean,
  totalPayment: number
): boolean {
  return canShowActions && totalPayment < 0;
}

// ============================================================
// ALL-IN-ONE CALCULATOR
// ============================================================

/**
 * Tính toán tất cả state và điều kiện hiển thị
 * 
 * @param ticket - Phiếu bảo hành
 * @param payments - Tất cả phiếu chi trong hệ thống
 * @param receipts - Tất cả phiếu thu trong hệ thống
 * @param totalPayment - Tổng tiền cần thanh toán từ warranty (từ summary)
 * @returns WarrantyProcessingState - Tất cả state đã tính toán
 */
export function calculateWarrantyProcessingState(
  ticket: WarrantyTicket | null,
  payments: Payment[],
  receipts: Receipt[],
  totalPayment: number
): WarrantyProcessingState {
  if (!ticket) {
    return {
      ticket: null,
      payments: [],
      receipts: [],
      totalPayment: 0,
      warrantyPayments: [],
      warrantyReceipts: [],
      totalPaid: 0,
      remainingAmount: 0,
      hasTransactions: false,
      allTransactionsCancelled: false,
      shouldHideCard: true,
      canShowActionButtons: false,
      canShowPaymentButton: false,
      canShowReceiptButton: false,
    };
  }
  
  // 1. Lọc phiếu chi/thu liên quan
  const warrantyPayments = getWarrantyPayments(payments, ticket.systemId);
  const warrantyReceipts = getWarrantyReceipts(receipts, ticket.systemId);
  
  // 2. Tính toán số liệu
  const { totalPayments, totalReceipts } = calculateTotalPaid(warrantyPayments, warrantyReceipts);
  
  // ✅ FIX: Calculate remaining amount correctly for WARRANTY flow
  // - totalPayment > 0: SHOP NỢ KHÁCH (hàng out of stock) → Cần tạo PHIẾU CHI → So sánh với totalPayments
  // - totalPayment < 0: KHÁCH NỢ SHOP (rare case) → Cần tạo PHIẾU THU → So sánh với totalReceipts
  let remainingAmount = 0;
  if (totalPayment > 0) {
    // Shop owes customer → need to create PAYMENT voucher → check totalPayments
    remainingAmount = totalPayment - totalPayments;
  } else if (totalPayment < 0) {
    // Customer owes shop → need to create RECEIPT voucher → check totalReceipts
    remainingAmount = Math.abs(totalPayment) - totalReceipts;
  }
  // If totalPayment === 0, remainingAmount = 0 (no payment needed)
  
  const totalPaid = totalReceipts - totalPayments; // For backward compatibility
  const hasTransactions = hasAnyTransactions(warrantyPayments, warrantyReceipts);
  const allTransactionsCancelled = areAllTransactionsCancelled(warrantyPayments, warrantyReceipts);
  
  // 3. Tính điều kiện hiển thị
  const hideCard = shouldHideCard(ticket, hasTransactions);
  const showActionButtons = canShowActionButtons(ticket, totalPayment, remainingAmount, hasTransactions, allTransactionsCancelled);
  const showPaymentButton = canShowPaymentButton(showActionButtons, totalPayment);
  const showReceiptButton = canShowReceiptButton(showActionButtons, totalPayment);
  
  return {
    ticket,
    payments,
    receipts,
    totalPayment,
    warrantyPayments,
    warrantyReceipts,
    totalPaid,
    remainingAmount,
    hasTransactions,
    allTransactionsCancelled,
    shouldHideCard: hideCard,
    canShowActionButtons: showActionButtons,
    canShowPaymentButton: showPaymentButton,
    canShowReceiptButton: showReceiptButton,
  };
}

// ============================================================
// DEBUG HELPERS
// ============================================================

/**
 * In ra console tất cả điều kiện để debug
 */
export function debugWarrantyProcessing(state: WarrantyProcessingState): void {
  console.group('🔍 [WARRANTY PROCESSING] Debug State');
  
  console.log('📋 Input:', {
    ticketId: state.ticket?.id,
    ticketStatus: state.ticket?.status,
    cancelledAt: state.ticket?.cancelledAt,
    totalPayment: state.totalPayment,
  });
  
  console.log('💰 Calculations:', {
    warrantyPayments: state.warrantyPayments.length,
    warrantyReceipts: state.warrantyReceipts.length,
    totalPaid: state.totalPaid,
    remainingAmount: state.remainingAmount,
    hasTransactions: state.hasTransactions,
    allCancelled: state.allTransactionsCancelled,
  });
  
  console.log('🎯 Display Flags:', {
    shouldHideCard: state.shouldHideCard,
    canShowActionButtons: state.canShowActionButtons,
    canShowPaymentButton: state.canShowPaymentButton,
    canShowReceiptButton: state.canShowReceiptButton,
  });
  
  console.groupEnd();
}
