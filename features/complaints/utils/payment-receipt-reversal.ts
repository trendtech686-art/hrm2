/**
 * PAYMENT & RECEIPT REVERSAL UTILITY
 * 
 * Utility để hủy phiếu chi/thu và kiểm kê (phiếu tự động khôi phục kho)
 * 
 * FEATURES:
 * 1. CANCEL: Mark phiếu chi/thu/kiểm kê as 'cancelled' (KHÔNG XÓA)
 * 2. AUTO RESTORE: Phiếu tự động khôi phục kho khi cancelled
 * 3. TRACKING: Lưu lịch sử phiếu đã hủy vào complaint.cancelledPaymentsReceipts[]
 * 4. SAFETY: Tự động check existence trước khi cancel
 */

import type { Complaint } from '../types';
import type { SystemId, BusinessId } from '@/lib/id-types';
import { logError } from '@/lib/logger'

export interface ReversalResult {
  cancelledPaymentsReceipts: string[]; // Danh sách phiếu đã hủy (display messages)
  totalAmount: number;         // Tổng tiền phiếu đã hủy
  cancelledPaymentsReceiptsHistory: Array<{      // Lịch sử để lưu vào complaint.cancelledPaymentsReceipts
    paymentReceiptSystemId: SystemId;
    paymentReceiptId: BusinessId;
    type: 'payment' | 'receipt';
    amount: number;
    cancelledAt: Date;
    cancelledBy: SystemId;
    cancelledReason: string;
  }>;
  inventoryHistory?: {         // Lịch sử thêm phiếu kiểm kê bị hủy
    adjustedAt: Date;
    adjustedBy: SystemId;
    adjustmentType: 'reversed';
    reason: string;
    inventoryCheckSystemId: SystemId;
  };
  cancelledPenaltyIds?: SystemId[]; // Danh sách phiếu phạt đã hủy
}

/**
 * Hủy phiếu thu/chi/kiểm kê (phiếu tự động khôi phục kho)
 * 
 * @param complaint - Complaint object
 * @param currentUser - User thực hiện action
 * @param reason - Lý do hủy: "Mở lại khiếu nại", "Hủy khiếu nại", "Đổi verification"
 * @param options - { skipInventoryCheck?: boolean } - Nếu true, không hủy phiếu kiểm kê
 * @returns ReversalResult với thông tin chi tiết + lịch sử để lưu
 */
export async function cancelPaymentsReceiptsAndInventoryChecks(
  complaint: Complaint,
  currentUser: { systemId: SystemId; name: string },
  reason: string = "Mở lại khiếu nại",
  options?: { skipInventoryCheck?: boolean }
): Promise<ReversalResult> {
  
  const result: ReversalResult = {
    cancelledPaymentsReceipts: [],
    totalAmount: 0,
    cancelledPaymentsReceiptsHistory: [],
  };

  try {
    // ============================================
    // STEP 1: LAZY LOAD SERVER ACTIONS
    // ============================================
    const { cancelPaymentAction } = await import('@/app/actions/payments');
    const { cancelReceiptAction } = await import('@/app/actions/receipts');
    const { forceCancelInventoryCheckAction } = await import('@/app/actions/inventory-checks');
    const { updatePenalty } = await import('@/features/settings/penalties/api/penalties-api');

    // ============================================
    // STEP 2: TÌM PHIẾU LIÊN QUAN
    // ============================================
    // ⚠️ CRITICAL: Phiếu chi/thu/kiểm kho được lưu trong METADATA của action verified-correct CUỐI CÙNG
    const lastVerifiedCorrect = [...(complaint.timeline || [])]
      .reverse()
      .find(a => a.actionType === 'verified-correct');
    
    const actionMetadata = lastVerifiedCorrect?.metadata as { paymentSystemId?: SystemId; receiptSystemId?: SystemId; inventoryCheckSystemId?: SystemId; penaltySystemIds?: SystemId[] } | undefined;
    const paymentSystemId = actionMetadata?.paymentSystemId;
    const receiptSystemId = actionMetadata?.receiptSystemId;
    const inventoryCheckSystemId = actionMetadata?.inventoryCheckSystemId;
    const penaltySystemIds = actionMetadata?.penaltySystemIds || [];
    
    
    // Check if there's anything to cancel
    if (!paymentSystemId && !receiptSystemId && !inventoryCheckSystemId && penaltySystemIds.length === 0) {
      return result;
    }

    // ============================================
    // STEP 3: XỬ LÝ PHIẾU CHI (BÙ TRỪ KHÁCH)
    // ============================================
    if (paymentSystemId) {
      // ✅ Use Server Action to cancel payment in database
      const cancelResult = await cancelPaymentAction({
        systemId: paymentSystemId,
        reason: reason,
      });
      
      if (cancelResult.success && cancelResult.data) {
        const payment = cancelResult.data as { systemId: string; id: string; amount: number };
        result.totalAmount += payment.amount || 0;
        result.cancelledPaymentsReceipts.push(`Phiếu chi ${payment.id} (${payment.amount.toLocaleString('vi-VN')}đ)`);
        
        // Track history
        result.cancelledPaymentsReceiptsHistory.push({
          paymentReceiptSystemId: payment.systemId as SystemId,
          paymentReceiptId: payment.id as BusinessId,
          type: 'payment',
          amount: payment.amount,
          cancelledAt: new Date(),
          cancelledBy: currentUser.systemId,
          cancelledReason: reason,
        });
      }
    }

    // ============================================
    // STEP 4: XỬ LÝ PHIẾU THU (PHẠT NHÂN VIÊN)
    // ============================================
    if (receiptSystemId) {
      // ✅ Use Server Action to cancel receipt in database
      const cancelResult = await cancelReceiptAction({
        systemId: receiptSystemId,
        reason: reason,
      });
      
      if (cancelResult.success && cancelResult.data) {
        const receipt = cancelResult.data as { systemId: string; id: string; amount: number };
        result.totalAmount += receipt.amount || 0;
        result.cancelledPaymentsReceipts.push(`Phiếu thu ${receipt.id} (${receipt.amount.toLocaleString('vi-VN')}đ)`);
        
        // Track history
        result.cancelledPaymentsReceiptsHistory.push({
          paymentReceiptSystemId: receipt.systemId as SystemId,
          paymentReceiptId: receipt.id as BusinessId,
          type: 'receipt',
          amount: receipt.amount,
          cancelledAt: new Date(),
          cancelledBy: currentUser.systemId,
          cancelledReason: reason,
        });
      }
    }

    // ============================================
    // STEP 5: HỦY PHIẾU KIỂM KÊ (phiếu tự khôi phục kho)
    // ============================================
    // SKIP nếu skipInventoryCheck = true (khi hủy khiếu nại)
    if (inventoryCheckSystemId && !options?.skipInventoryCheck) {
      // ✅ Use Server Action to cancel inventory check in database
      const cancelResult = await forceCancelInventoryCheckAction({
        systemId: inventoryCheckSystemId,
        reason: reason,
        cancelledBy: currentUser.systemId,
      });
      
      if (cancelResult.success && cancelResult.data) {
        // Lưu lịch sử
        result.inventoryHistory = {
          adjustedAt: new Date(),
          adjustedBy: currentUser.systemId as SystemId,
          adjustmentType: 'reversed' as const,
          reason,
          inventoryCheckSystemId,
        };
      }
    }

    // ============================================
    // STEP 6: HỦY PHIẾU PHẠT
    // ============================================
    if (penaltySystemIds.length > 0) {
      const cancelledIds: SystemId[] = [];
      for (const penaltyId of penaltySystemIds) {
        try {
          await updatePenalty(penaltyId as string, { status: 'Đã hủy' });
          cancelledIds.push(penaltyId);
        } catch {
          // Penalty cancellation failed, skip
        }
      }
      if (cancelledIds.length > 0) {
        result.cancelledPenaltyIds = cancelledIds;
      }
    }

    return result;
    
  } catch (error) {
    logError('❌ [COMPLAINT REVERSAL] Error', error);
    throw error;
  }
}
