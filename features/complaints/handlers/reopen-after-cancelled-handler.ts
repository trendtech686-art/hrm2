import { toast } from 'sonner';
import type { Complaint, ComplaintAction } from '../types';

// User type - chi can systemId va name
interface User {
  systemId: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  employeeId?: string;
}

/**
 * Handler cho nut "Mo lai" SAU KHI HUY KHIEU NAI
 * 
 * LOGIC:
 * 1. KHONG huy phieu/kho (vi da huy roi khi bam "Huy khieu nai")
 * 2. Chi doi status ve "investigating"
 * 3. Doi verification ve "pending-verification"
 * 4. GIU NGUYEN: cancelledPaymentsReceipts, inventoryHistory (audit trail)
 * 5. Add timeline action "reopened"
 */
export async function handleReopenAfterCancelled(
  complaint: Complaint,
  currentUser: User,
  updateComplaint: (systemId: string, updates: any) => void
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('[REOPEN-AFTER-CANCEL] Starting...');
    
    // Khong can huy phieu/kho vi da huy roi
    console.log('[REOPEN-AFTER-CANCEL] Skip cancel (already cancelled)');
    
    // Build timeline action
    const timeline: ComplaintAction[] = [
      ...complaint.timeline,
      {
        id: `action_${Date.now()}`,
        actionType: "reopened",
        performedBy: currentUser.name,
        performedAt: new Date(),
        note: `Mở lại khiếu nại sau khi hủy`,
      }
    ];
    
    // Build update object - KHONG co cancelledPaymentsReceipts/inventoryHistory moi
    // Reset verification ve "pending-verification" de hien card xac minh
    const updates = {
      status: "investigating" as const,
      verification: "pending-verification" as const,
      timeline,
      reopenedBy: currentUser.systemId,
      reopenedAt: new Date(),
    };
    
    console.log('[REOPEN-AFTER-CANCEL] Updating with:', {
      status: updates.status,
      preservedFields: {
        cancelledPaymentsReceipts: !!(complaint as any).cancelledPaymentsReceipts,
        inventoryHistory: !!(complaint as any).inventoryHistory,
        inventoryAdjustment: !!(complaint as any).inventoryAdjustment,
        compensationMetadata: !!(complaint as any).compensationMetadata,
        verification: complaint.verification,
      }
    });
    
    // Update
    updateComplaint(complaint.systemId, updates);
    
    console.log('[REOPEN-AFTER-CANCEL] Complete!');
    
    toast.success('Đã mở lại khiếu nại');
    
    return {
      success: true,
      message: 'Đã mở lại khiếu nại'
    };
    
  } catch (error) {
    console.error('[REOPEN-AFTER-CANCEL] Error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
    toast.error(errorMsg);
    return {
      success: false,
      message: errorMsg
    };
  }
}
