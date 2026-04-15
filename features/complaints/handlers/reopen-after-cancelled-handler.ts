import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import type { Complaint, ComplaintAction } from '../types';
import { logError } from '@/lib/logger'

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
  updateComplaint: (systemId: string, updates: Partial<Complaint>) => Promise<void> | void
): Promise<{ success: boolean; message: string }> {
  try {
    
    // Khong can huy phieu/kho vi da huy roi
    
    // Build timeline action
    const timeline: ComplaintAction[] = [
      ...complaint.timeline,
      {
        id: asSystemId(generateSubEntityId('ACTION')),
        actionType: "reopened",
        performedBy: asSystemId(currentUser.systemId),
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
    
    
    // Update
    updateComplaint(complaint.systemId, updates);
    
    
    toast.success('Đã mở lại khiếu nại');
    
    return {
      success: true,
      message: 'Đã mở lại khiếu nại'
    };
    
  } catch (error) {
    logError('[REOPEN-AFTER-CANCEL] Error', error);
    const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
    toast.error(errorMsg);
    return {
      success: false,
      message: errorMsg
    };
  }
}
