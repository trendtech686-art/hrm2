import type { Complaint } from '../types';
import type { SystemId } from '@/lib/id-types';
import { cancelPaymentsReceiptsAndInventoryChecks, type ReversalResult } from './payment-receipt-reversal';

/**
 * UTILITY: Huy phieu chi/thu (phieu tu dong khoi phuc kho)
 * 
 * DUNG CHO:
 * 1. Huy khieu nai (cancel-handler) - CHỈ hủy phiếu thu/chi
 * 2. Mo lai khieu nai (reopen-handler) - Hủy tất cả
 * 3. Doi sang xac nhan sai (verify-incorrect-handler) - Hủy tất cả
 * 
 * LUU Y: Khi phieu chi/thu bi cancelled, phieu tu dong khoi phuc kho
 * KHONG can reverse thu cong!
 * 
 * @param complaint - Complaint object
 * @param currentUser - User info { systemId, name }
 * @param reason - Ly do huy (VD: "Huy khieu nai", "Doi sang xac nhan sai")
 * @param options - { skipInventoryCheck?: boolean } - Nếu true, không hủy phiếu kiểm kê
 * @returns Promise<{ cancelledPaymentsReceiptsHistory, inventoryHistory }>
 */
export async function cancelPaymentsReceiptsAndInventory(
  complaint: Complaint,
  currentUser: { systemId: SystemId; name: string },
  reason: string,
  options?: { skipInventoryCheck?: boolean }
): Promise<{
  cancelledPaymentsReceiptsHistory: ReversalResult['cancelledPaymentsReceiptsHistory'];
  inventoryHistory: ReversalResult['inventoryHistory'] | null;
}> {
  console.log(`[CANCEL UTIL] Starting: ${reason}`);
  
  // STEP 1: Check xem co phieu/kho khong
  // ⚠️ CRITICAL: Phiếu chi/thu được lưu trong METADATA của action verified-correct CUỐI CÙNG
  const lastVerifiedCorrect = [...complaint.timeline]
    .reverse()
    .find(a => a.actionType === 'verified-correct');
  
  const actionMetadata = lastVerifiedCorrect?.metadata;
  const hasPaymentsReceipts = actionMetadata?.paymentSystemId || actionMetadata?.receiptSystemId;
  const hasInventoryCheck = actionMetadata?.inventoryCheckSystemId;
  
  console.log('[CANCEL UTIL] Check:', { 
    hasPaymentsReceipts, 
    hasInventoryCheck,
    paymentSystemId: actionMetadata?.paymentSystemId,
    receiptSystemId: actionMetadata?.receiptSystemId,
    inventoryCheckSystemId: actionMetadata?.inventoryCheckSystemId,
  });
  
  if (!hasPaymentsReceipts && !hasInventoryCheck) {
    console.log('[CANCEL UTIL] Nothing to cancel');
    return { cancelledPaymentsReceiptsHistory: [], inventoryHistory: null };
  }
  
  // STEP 2: Goi function cancelPaymentsReceiptsAndInventoryChecks
  const result = await cancelPaymentsReceiptsAndInventoryChecks(
    complaint, 
    currentUser, 
    reason,
    options
  );
  
  console.log('[CANCEL UTIL] Result:', {
    paymentsReceiptsCount: result.cancelledPaymentsReceiptsHistory.length,
    hasInventoryHistory: !!result.inventoryHistory,
  });
  
  return {
    cancelledPaymentsReceiptsHistory: result.cancelledPaymentsReceiptsHistory ?? [],
    inventoryHistory: result.inventoryHistory ?? null,
  };
}
