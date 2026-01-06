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
import { asSystemId } from '@/lib/id-types';
import type { SystemId, BusinessId } from '@/lib/id-types';

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
    // STEP 1: LAZY LOAD STORES
    // ============================================
    const { useReceiptStore } = await import('../../receipts/store');
    const { usePaymentStore } = await import('../../payments/store');
    const { useProductStore } = await import('../../products/store');
    
    const receiptStore = useReceiptStore.getState();
    const paymentStore = usePaymentStore.getState();
    const _productStore = useProductStore.getState();

    // ============================================
    // STEP 2: TÌM PHIẾU LIÊN QUAN
    // ============================================
    // ⚠️ CRITICAL: Phiếu chi/thu/kiểm kho được lưu trong METADATA của action verified-correct CUỐI CÙNG
    const lastVerifiedCorrect = [...complaint.timeline]
      .reverse()
      .find(a => a.actionType === 'verified-correct');
    
    const actionMetadata = lastVerifiedCorrect?.metadata as { paymentSystemId?: SystemId; receiptSystemId?: SystemId; inventoryCheckSystemId?: SystemId } | undefined;
    const paymentSystemId = actionMetadata?.paymentSystemId;
    const receiptSystemId = actionMetadata?.receiptSystemId;
    const inventoryCheckSystemId = actionMetadata?.inventoryCheckSystemId;
    
    
    // Check if there's anything to cancel
    if (!paymentSystemId && !receiptSystemId && !inventoryCheckSystemId) {
      return result;
    }

    // ============================================
    // STEP 3: XỬ LÝ PHIẾU CHI (BÙ TRỪ KHÁCH)
    // ============================================
    if (paymentSystemId) {
      const payment = paymentStore.data.find(v => v.systemId === paymentSystemId);
      
      
      if (payment) {
        result.totalAmount += payment.amount || 0;
        
        // ✅ LUÔN LUÔN mark as cancelled (KHÔNG BAO GIỜ XÓA - audit trail)
        if (payment.status !== 'cancelled') {
          
          paymentStore.update(payment.systemId, {
            ...payment,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            // Note: cancelledBy not in Payment type, tracked in history
          });
          
          // Verify the update worked
          const _updatedPayment = paymentStore.data.find(v => v.systemId === paymentSystemId);
          
          result.cancelledPaymentsReceipts.push(`Phiếu chi ${payment.id} (${payment.amount.toLocaleString('vi-VN')}đ)`);
          
          // Track history
          result.cancelledPaymentsReceiptsHistory.push({
            paymentReceiptSystemId: payment.systemId,
            paymentReceiptId: payment.id,
            type: 'payment',
            amount: payment.amount,
            cancelledAt: new Date(),
            cancelledBy: currentUser.systemId,
            cancelledReason: reason,
          });
          
        }
        // else: already cancelled, skip
      }
      // else: payment not found, skip
    }

    // ============================================
    // STEP 4: XỬ LÝ PHIẾU THU (PHẠT NHÂN VIÊN)
    // ============================================
    if (receiptSystemId) {
      const receipt = receiptStore.data.find(v => v.systemId === receiptSystemId);
      
      
      if (receipt) {
        result.totalAmount += receipt.amount || 0;
        
        // ✅ LUÔN LUÔN mark as cancelled (KHÔNG BAO GIỜ XÓA - audit trail)
        if (receipt.status !== 'cancelled') {
          
          receiptStore.update(receipt.systemId, {
            ...receipt,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
          });
          
          // Verify the update worked
          const _updatedReceipt = receiptStore.data.find(v => v.systemId === receiptSystemId);
          
          
          result.cancelledPaymentsReceipts.push(`Phiếu thu ${receipt.id} (${receipt.amount.toLocaleString('vi-VN')}đ)`);
          
          // Track history
          result.cancelledPaymentsReceiptsHistory.push({
            paymentReceiptSystemId: receipt.systemId,
            paymentReceiptId: receipt.id,
            type: 'receipt',
            amount: receipt.amount,
            cancelledAt: new Date(),
            cancelledBy: currentUser.systemId,
            cancelledReason: reason,
          });
          
        }
        // else: already cancelled, skip
      }
    }

    // ============================================
    // STEP 5: HỦY PHIẾU KIỂM KÊ (phiếu tự khôi phục kho)
    // ============================================
    // SKIP nếu skipInventoryCheck = true (khi hủy khiếu nại)
    if (inventoryCheckSystemId && !options?.skipInventoryCheck) {
      const { useInventoryCheckStore } = await import('../../inventory-checks/store');
      const inventoryCheckStore = useInventoryCheckStore.getState();
      const inventoryCheck = inventoryCheckStore.data.find(ic => ic.systemId === inventoryCheckSystemId);
      
      if (inventoryCheck && inventoryCheck.status !== 'cancelled') {
        // Hủy phiếu kiểm kê (phiếu tự động khôi phục kho)
        inventoryCheckStore.update(inventoryCheck.systemId, {
          ...inventoryCheck,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancelledBy: asSystemId(currentUser.systemId),
          cancelledReason: reason,
        });
        
        
        // Lưu lịch sử
        result.inventoryHistory = {
          adjustedAt: new Date(),
          adjustedBy: currentUser.systemId as SystemId,
          adjustmentType: 'reversed' as const,
          reason,
          inventoryCheckSystemId,
        };
      }
      // else: already cancelled, skip
    }

    return result;
    
  } catch (error) {
    console.error('❌ [COMPLAINT REVERSAL] Error:', error);
    throw error;
  }
}
