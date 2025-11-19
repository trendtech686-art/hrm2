import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import type { Complaint, ComplaintAction } from '../types';
import type { SystemId } from '@/lib/id-types';

// User type - chi can systemId va name
interface User {
  systemId: SystemId;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  employeeId?: string;
}

/**
 * Handler cho nut "Mo lai" SAU KHI KET THUC
 * 
 * LOGIC:
 * 1. KHONG huy phieu/kho (vi ket thuc khong huy gi ca)
 * 2. Chi doi status ve "investigating"
 * 3. KHONG reset verification (da xac minh roi)
 * 4. GIU NGUYEN tat ca data (inventoryAdjustment, compensationMetadata, verification)
 * 5. Add timeline action "reopened"
 */
export async function handleReopenAfterResolved(
  complaint: Complaint,
  currentUser: User,
  updateComplaint: (systemId: SystemId, updates: any) => void
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('[REOPEN-AFTER-RESOLVE] Starting...');
    
    // Khong can huy phieu/kho vi ket thuc khong huy gi
    console.log('[REOPEN-AFTER-RESOLVE] Skip cancel (resolved status)');
    
    // Build timeline action
    const timeline: ComplaintAction[] = [
      ...complaint.timeline,
      {
        id: asSystemId(`action_${Date.now()}`),
        actionType: "reopened",
        performedBy: asSystemId(currentUser.systemId),
        performedAt: new Date(),
        note: `Mở lại khiếu nại sau khi kết thúc`,
      }
    ];
    
    // Build update object - GIU NGUYEN tat ca
    // KHONG reset verification - da xac minh roi
    const updates = {
      status: "investigating" as const,
      timeline,
      reopenedBy: currentUser.systemId,
      reopenedAt: new Date(),
      // KEEP all fields including endedBy, resolvedBy, verification (audit trail)
    };
    
    console.log('[REOPEN-AFTER-RESOLVE] Updating with:', {
      status: updates.status,
      preservedFields: {
        inventoryAdjustment: !!(complaint as any).inventoryAdjustment,
        compensationMetadata: !!(complaint as any).compensationMetadata,
        verification: complaint.verification,
      }
    });
    
    // Update
    updateComplaint(complaint.systemId, updates);
    
    console.log('[REOPEN-AFTER-RESOLVE] Complete!');
    
    toast.success('Đã mở lại khiếu nại');
    
    return {
      success: true,
      message: 'Đã mở lại khiếu nại'
    };
    
  } catch (error) {
    console.error('[REOPEN-AFTER-RESOLVE] Error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
    toast.error(errorMsg);
    return {
      success: false,
      message: errorMsg
    };
  }
}
