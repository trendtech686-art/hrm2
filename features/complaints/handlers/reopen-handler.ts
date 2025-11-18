import { toast } from 'sonner';
import type { Complaint } from '../types';
import { cancelPaymentsReceiptsAndInventory } from '../utils/cancel-payments-receipts-and-inventory';
import { handleReopenAfterCancelled } from './reopen-after-cancelled-handler';
import { handleReopenAfterResolved } from './reopen-after-resolved-handler';

// User type - chỉ cần systemId và name
interface User {
  systemId: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  employeeId?: string;
}

/**
 * Handler cho nút "Mở lại khiếu nại"
 * 
 * ROUTING LOGIC:
 * 1. Nếu status = "cancelled" → Gọi handleReopenAfterCancelled (đã hủy rồi, không hủy lại)
 * 2. Nếu status = "resolved" → Gọi handleReopenAfterResolved (kết thúc không hủy gì)
 * 3. Nếu status khác → Hủy phiếu/kho trước khi mở lại (case này ít khi xảy ra)
 */
export async function handleReopenComplaint(
  complaint: Complaint,
  currentUser: User,
  updateComplaint: (systemId: string, updates: any) => void
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('[REOPEN] Starting...', { 
      status: complaint.status,
      verification: complaint.verification 
    });
    
    // CASE 1: Mở lại sau khi HỦY KHIẾU NẠI
    if (complaint.status === 'cancelled') {
      console.log('[REOPEN] Case 1: Reopen after cancelled');
      return handleReopenAfterCancelled(complaint, currentUser, updateComplaint);
    }
    
    // CASE 2: Mở lại sau khi KẾT THÚC
    if (complaint.status === 'resolved') {
      console.log('[REOPEN] Case 2: Reopen after resolved');
      return handleReopenAfterResolved(complaint, currentUser, updateComplaint);
    }
    
    // CASE 3: Mở lại từ trạng thái khác (investigating, pending, etc.)
    // Case này ít khi xảy ra nhưng vẫn xử lý để đảm bảo
    console.log('[REOPEN] Case 3: Reopen from other status - need to cancel payments/receipts');
    
    // Hủy phiếu và kho nếu có
    const { cancelledPaymentsReceiptsHistory, inventoryHistory } = await cancelPaymentsReceiptsAndInventory(
      complaint,
      currentUser,
      "Mở lại khiếu nại"
    );
    
    // Merge histories
    const existingHistory = (complaint as any).cancelledPaymentsReceipts || [];
    const cancelledPaymentsReceipts = [...existingHistory, ...cancelledPaymentsReceiptsHistory];
    
    const existingInventoryHistory = (complaint as any).inventoryHistory || [];
    const updatedInventoryHistory = inventoryHistory 
      ? [...existingInventoryHistory, inventoryHistory]
      : existingInventoryHistory;
    
    // Update
    const updates = {
      status: "investigating" as const,
      verification: "pending-verification" as const,
      timeline: [
        ...complaint.timeline,
        {
          id: `action_${Date.now()}`,
          actionType: "reopened" as const,
          performedBy: currentUser.name,
          performedAt: new Date(),
          note: `Mở lại khiếu nại`,
        }
      ],
      cancelledPaymentsReceipts,
      inventoryHistory: updatedInventoryHistory,
      reopenedBy: currentUser.systemId,
      reopenedAt: new Date(),
      // Clear fields
      endedBy: null,
      endedAt: null,
      resolvedBy: null,
      resolvedAt: null,
      cancelledBy: null,
      cancelledAt: null,
    };
    
    updateComplaint(complaint.systemId, updates);
    
    console.log('[REOPEN] Complete (Case 3)!');
    
    toast.success('Đã mở lại khiếu nại');
    
    return {
      success: true,
      message: 'Đã mở lại khiếu nại'
    };
    
  } catch (error) {
    console.error('[REOPEN] Error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
    toast.error(errorMsg);
    return {
      success: false,
      message: errorMsg
    };
  }
}
