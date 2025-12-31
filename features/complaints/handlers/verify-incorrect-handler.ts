import { asSystemId } from '@/lib/id-types';
import type { SystemId } from '@/lib/id-types';
import type { Complaint, ComplaintAction } from '../types';
import { cancelPaymentsReceiptsAndInventory } from '../utils/cancel-payments-receipts-and-inventory';

// User type - chỉ cần systemId và name
interface User {
  systemId: SystemId;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  employeeId?: string;
}

/**
 * Handler cho nút "Xác nhận sai"
 * 
 * LOGIC:
 * 1. HỦY phiếu nếu đã có (phiếu tự khôi phục kho)
 * 2. Update verification = 'verified-incorrect'
 * 3. GIỮ NGUYÊN: inventoryAdjustment, compensationMetadata (audit trail - để hiện accordion cũ)
 * 4. Merge histories vào cancelledPaymentsReceipts và inventoryHistory
 * 5. Add timeline action + employeeImages + verificationEvidence
 */
export async function handleVerifyIncorrect(
  complaint: Complaint,
  currentUser: User,
  evidenceNote: string,
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => void,
  options?: {
    evidenceImages?: string[];
    evidenceVideos?: string[];
    employeeImages?: Array<{ id: string; url: string; uploadedAt: Date; uploadedBy: string }>;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('[VERIFY-INCORRECT] Starting...');
    
    // STEP 1: Hủy phiếu (phiếu tự động khôi phục kho)
    const { cancelledPaymentsReceiptsHistory, inventoryHistory } = await cancelPaymentsReceiptsAndInventory(
      complaint,
      currentUser,
      "Đổi sang xác nhận sai"
    );
    
    // STEP 3: Build timeline action
    const timeline: ComplaintAction[] = [
      ...complaint.timeline,
      {
        id: asSystemId(`action_${Date.now()}`),
        actionType: "verified-incorrect",
        performedBy: asSystemId(currentUser.systemId),
        performedAt: new Date(),
        note: evidenceNote ? `Xác nhận khiếu nại sai: ${evidenceNote}` : 'Xác nhận khiếu nại sai',
        metadata: {
          evidenceImages: options?.evidenceImages || [],
          evidenceVideos: options?.evidenceVideos || [],
        },
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
    const updates: Record<string, unknown> = {
      verification: "verified-incorrect" as const,
      timeline,
      cancelledPaymentsReceipts,
      inventoryHistory: updatedInventoryHistory,
      verifiedIncorrectAt: new Date(),
      verifiedIncorrectBy: currentUser.systemId,
      verifiedIncorrectNote: evidenceNote,
    };
    
    // Add verificationEvidence nếu có
    if (options?.evidenceImages || options?.evidenceVideos) {
      updates.verificationEvidence = {
        images: options.evidenceImages || [],
        videos: options.evidenceVideos || [],
        note: evidenceNote,
        verifiedBy: currentUser.systemId,
        verifiedAt: new Date(),
      };
    }
    
    // Add employeeImages nếu có
    if (options?.employeeImages && options.employeeImages.length > 0) {
      updates.employeeImages = [
        ...(complaint.employeeImages || []),
        ...options.employeeImages.map(img => ({
          id: asSystemId(img.id || `img_${Date.now()}`),
          url: img.url,
          uploadedBy: asSystemId(img.uploadedBy || currentUser.systemId),
          uploadedAt: img.uploadedAt || new Date(),
        })),
      ];
    }
    
    console.log('[VERIFY-INCORRECT] Updating with:', {
      verification: updates.verification,
      cancelledPaymentsReceiptsCount: cancelledPaymentsReceipts.length,
      inventoryHistoryCount: updatedInventoryHistory.length,
      hasEmployeeImages: !!updates.employeeImages,
      hasVerificationEvidence: !!updates.verificationEvidence,
      willPreserve: {
        inventoryAdjustment: !!complaint.inventoryAdjustment,
        compensationMetadata: !!(complaint as Complaint & { compensationMetadata?: unknown }).compensationMetadata,
      }
    });
    
    // STEP 6: Update
    updateComplaint(complaint.systemId, updates as Partial<Complaint>);
    
    console.log('[VERIFY-INCORRECT] Complete!');
    
    return {
      success: true,
      message: 'Đã xác nhận khách hàng phản hồi sai và hủy các phiếu đã tạo'
    };
    
  } catch (error) {
    console.error('[VERIFY-INCORRECT] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra'
    };
  }
}
