/**
 * Verification Handlers Hook
 * Handles complaint verification (correct/incorrect)
 */

import * as React from 'react';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import type { SystemId } from '@/lib/id-types';
import type { Complaint, ComplaintAction } from '../types';
import type { ComplaintPermissions } from './use-complaint-permissions';
import { complaintNotifications } from '../notification-utils';
import { handleVerifyIncorrect } from '../handlers/verify-incorrect-handler';

interface UseVerificationHandlersProps {
  complaint: Complaint | null;
  currentUser: { systemId: SystemId; name: string };
  permissions: ComplaintPermissions;
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => void;
}

export function useVerificationHandlers({
  complaint,
  currentUser,
  permissions,
  updateComplaint,
}: UseVerificationHandlersProps) {
  
  // ==========================================
  // VERIFY CORRECT - WITH DIALOG
  // ==========================================
  const handleConfirmCorrect = React.useCallback((note: string, confirmedQuantities: Record<SystemId, number>) => {
    if (!complaint) return;

    const newAction: ComplaintAction = {
      id: asSystemId(`action_${Date.now()}`),
      actionType: "verified-correct",
      performedBy: asSystemId(currentUser.systemId),
      performedAt: new Date(),
      note: note ? `Xác nhận khiếu nại đúng: ${note}` : "Xác nhận khiếu nại đúng",
      metadata: {
        confirmedQuantities,
      },
    };
    
    updateComplaint(complaint.systemId, {
      verification: "verified-correct",
      isVerifiedCorrect: true,
      timeline: [...complaint.timeline, newAction],
    } as any);
    
    toast.success("Đã xác nhận khiếu nại đúng");
    complaintNotifications.onVerified("Đã xác nhận khiếu nại đúng");
  }, [complaint, currentUser, updateComplaint]);

  // ==========================================
  // VERIFY INCORRECT - SUBMIT EVIDENCE
  // ==========================================
  const handleSubmitIncorrectEvidence = React.useCallback(async (
    stagingFiles: any[], 
    videoLinks: string[], 
    note: string
  ) => {
    if (!complaint) return;
    if (stagingFiles.length === 0 && videoLinks.length === 0 && !note.trim()) {
      toast.error("Vui lòng upload ảnh/video hoặc nhập ghi chú");
      return;
    }
    
    try {
      // Confirm files if any
      let confirmedImages: string[] = [];
      if (stagingFiles.length > 0) {
        const { FileUploadAPI } = await import('../../../lib/file-upload-api');
        const stagingIds = stagingFiles.map(f => f.id);
        // Use confirmStagingFiles instead
        const confirmed = await FileUploadAPI.confirmStagingFiles(
          stagingFiles[0].sessionId,
          currentUser.systemId,
          'complaint-evidence',
          `Evidence for complaint ${complaint.id}`
        );
        confirmedImages = confirmed.map(c => c.url);
      }
      
      // Convert confirmed images to employeeImages format
      const newEmployeeImages = confirmedImages.map((url, idx) => ({
        id: asSystemId(`complaint-employee-image-${Date.now()}-${idx}`),
        url,
        uploadedAt: new Date(),
        uploadedBy: currentUser.systemId,
      }));
      
      // ⚠️ CRITICAL: Tìm action verified-correct CUỐI CÙNG để check metadata
      const lastVerifiedCorrect = [...complaint.timeline]
        .reverse()
        .find(a => a.actionType === 'verified-correct');
      
      const hasPaymentsReceipts = 
        lastVerifiedCorrect?.metadata?.paymentSystemId || 
        lastVerifiedCorrect?.metadata?.receiptSystemId;
      
      const hasInventoryCheck = lastVerifiedCorrect?.metadata?.inventoryCheckSystemId;
      
      console.log('[VERIFY-INCORRECT] Check cancellation needed:', {
        hasPaymentsReceipts,
        hasInventoryCheck,
        willCallHandler: !!(hasPaymentsReceipts || hasInventoryCheck),
        metadata: lastVerifiedCorrect?.metadata,
      });
      
      if (hasPaymentsReceipts || hasInventoryCheck) {
        // Use handler to cancel payments/receipts (phiếu tự động khôi phục kho)
        console.log('[VERIFY-INCORRECT] Calling handler to cancel...');
        const result = await handleVerifyIncorrect(
          complaint,
          currentUser,
          note || "Đã xác nhận khiếu nại SAI - Có bằng chứng",
          updateComplaint,
          {
            evidenceImages: confirmedImages,
            evidenceVideos: videoLinks,
            employeeImages: newEmployeeImages,
          }
        );
        
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        
        toast.success("Đã xác nhận khiếu nại sai và đã hủy các phiếu/kho trước đó");
        complaintNotifications.onVerified("Đã xác nhận khiếu nại SAI và đã hủy các phiếu/kho trước đó");
      } else {
        // No payments/receipts/inventory, just update verification status
        const newAction: ComplaintAction = {
          id: asSystemId(`action_${Date.now()}`),
          actionType: "verified-incorrect",
          performedBy: asSystemId(currentUser.systemId),
          performedAt: new Date(),
          note: note || "Đã xác nhận khiếu nại SAI - Có bằng chứng",
          metadata: {
            evidenceImages: confirmedImages,
            evidenceVideos: videoLinks,
          },
        };

        updateComplaint(complaint.systemId, {
          verification: "verified-incorrect",
          verificationEvidence: {
            images: confirmedImages,
            videos: videoLinks,
            note,
            verifiedBy: currentUser.systemId,
            verifiedAt: new Date(),
          },
          employeeImages: [
            ...((complaint as any).employeeImages || []),
            ...newEmployeeImages,
          ],
          timeline: [...complaint.timeline, newAction],
        } as any);
        
        toast.success("Đã xác nhận khiếu nại sai");
        complaintNotifications.onVerified("Đã xác nhận khiếu nại SAI");
      }
    } catch (error) {
      console.error('Error submitting evidence:', error);
      toast.error('Lỗi khi upload bằng chứng');
    }
  }, [complaint, updateComplaint, currentUser]);

  return {
    handleConfirmCorrect,
    handleSubmitIncorrectEvidence,
  };
}
