import { toast } from 'sonner';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import type { Complaint, ComplaintAction } from '../types';
import { cancelPaymentsReceiptsAndInventory } from '../utils/cancel-payments-receipts-and-inventory';
import { logError } from '@/lib/logger'

// User type - chỉ cần systemId và name
interface User {
  systemId: SystemId;
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
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => Promise<void> | void
): Promise<{ success: boolean; message: string }> {
  try {
    
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
      ...(complaint.timeline || []),
      {
        id: asSystemId(generateSubEntityId('ACTION')),
        actionType: "cancelled",
        performedBy: currentUser.systemId,
        performedAt: new Date(),
        note: `Hủy khiếu nại`,
      }
    ];
    
    // STEP 4: Merge histories (giữ history cũ + thêm mới)
    const existingHistory = complaint.cancelledPaymentsReceipts || [];
    const cancelledPaymentsReceipts = [...existingHistory, ...cancelledPaymentsReceiptsHistory];
    
    const existingInventoryHistory = complaint.inventoryHistory || [];
    const updatedInventoryHistory = inventoryHistory 
      ? [...existingInventoryHistory, inventoryHistory]
      : existingInventoryHistory;
    
    // STEP 5: Build update object - CHỈ UPDATE NHỮNG GÌ CẦN
    const updates: Partial<Complaint> = {
      status: "cancelled" as const,
      cancelledBy: currentUser.systemId,
      cancelledAt: new Date(),
      timeline,
      cancelledPaymentsReceipts,
      inventoryHistory: updatedInventoryHistory as Complaint['inventoryHistory'],
    };
    
    
    // STEP 6: Update (await to ensure UI refresh)
    await updateComplaint(complaint.systemId, updates);
    
    
    toast.success('Đã hủy khiếu nại');
    
    return {
      success: true,
      message: 'Đã hủy khiếu nại'
    };
    
  } catch (error) {
    logError('[CANCEL] Error', error);
    const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
    toast.error(errorMsg);
    return {
      success: false,
      message: errorMsg
    };
  }
}
