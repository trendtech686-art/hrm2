import { toast } from 'sonner';
import type { Complaint, ComplaintAction } from '../types';
import { cancelPaymentsReceiptsAndInventory } from '../utils/cancel-payments-receipts-and-inventory';

// User type - chỉ cần systemId và name
interface User {
  systemId: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  employeeId?: string;
}

/**
 * Handler cho nút "Hủy khiếu nại"
 * 
 * LOGIC:
 * 1. Hủy các phiếu chi/thu + phiếu kiểm kê (mark as cancelled, KHÔNG XÓA)
 * 2. Phiếu tự động khôi phục kho (KHÔNG cần reverse thủ công)
 * 3. Lưu history vào complaint.cancelledPaymentsReceipts
 * 4. Update status = 'cancelled'
 * 5. GIỮ NGUYÊN: inventoryAdjustment, compensationMetadata (audit trail)
 */
export async function handleCancelComplaint(
  complaint: Complaint,
  currentUser: User,
  updateComplaint: (systemId: string, updates: any) => void
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('[CANCEL] Starting cancel process...');
    
    // STEP 1: Hủy phiếu (phiếu tự động khôi phục kho)
    // HỦY TẤT CẢ: phiếu thu/chi + phiếu kiểm kê
    const { cancelledPaymentsReceiptsHistory, inventoryHistory } = await cancelPaymentsReceiptsAndInventory(
      complaint,
      currentUser,
      "Hủy khiếu nại"
      // KHÔNG pass skipInventoryCheck → hủy cả phiếu kiểm kê
    );
    
    // STEP 3: Build timeline action
    const timeline: ComplaintAction[] = [
      ...complaint.timeline,
      {
        id: `action_${Date.now()}`,
        actionType: "cancelled",
        performedBy: currentUser.name,
        performedAt: new Date(),
        note: `Hủy khiếu nại`,
      }
    ];
    
    // STEP 4: Merge histories (giữ history cũ + thêm mới)
    const existingHistory = (complaint as any).cancelledPaymentsReceipts || [];
    const cancelledPaymentsReceipts = [...existingHistory, ...cancelledPaymentsReceiptsHistory];
    
    const existingInventoryHistory = (complaint as any).inventoryHistory || [];
    const updatedInventoryHistory = inventoryHistory 
      ? [...existingInventoryHistory, inventoryHistory]
      : existingInventoryHistory;
    
    // STEP 5: Build update object - CHỈ UPDATE NHỮNG GÌ CẦN
    const updates = {
      status: "cancelled" as const,
      cancelledBy: currentUser.systemId,
      cancelledAt: new Date(),
      timeline,
      cancelledPaymentsReceipts,
      inventoryHistory: updatedInventoryHistory,
    };
    
    console.log('[CANCEL] Updating complaint with:', {
      status: updates.status,
      cancelledPaymentsReceiptsCount: cancelledPaymentsReceipts.length,
      inventoryHistoryCount: updatedInventoryHistory.length,
      preservedFields: {
        inventoryAdjustment: !!(complaint as any).inventoryAdjustment,
        compensationMetadata: !!(complaint as any).compensationMetadata,
      }
    });
    
    // STEP 6: Update
    updateComplaint(complaint.systemId, updates);
    
    console.log('[CANCEL] Complete!');
    
    toast.success('Đã hủy khiếu nại');
    
    return {
      success: true,
      message: 'Đã hủy khiếu nại'
    };
    
  } catch (error) {
    console.error('[CANCEL] Error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
    toast.error(errorMsg);
    return {
      success: false,
      message: errorMsg
    };
  }
}
