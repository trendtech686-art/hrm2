/**
 * Verification Handlers Hook
 * Handles complaint verification (correct/incorrect)
 */

import * as React from 'react';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import type { SystemId } from '@/lib/id-types';
import type { Complaint, ComplaintAction } from '../types';
import type { ComplaintPermissions } from './use-complaint-permissions';
import { complaintNotifications } from '../notification-utils';
import { handleVerifyIncorrect } from '../handlers/verify-incorrect-handler';
import { logError } from '@/lib/logger'

interface UseVerificationHandlersProps {
  complaint: Complaint | null;
  currentUser: { systemId: SystemId; name: string };
  permissions?: ComplaintPermissions;
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => Promise<void> | void;
}

export function useVerificationHandlers({
  complaint,
  currentUser,
  permissions: _permissions,
  updateComplaint,
}: UseVerificationHandlersProps) {
  
  // ==========================================
  // VERIFY CORRECT - WITH DIALOG
  // ==========================================
  const handleConfirmCorrect = React.useCallback(async (note: string, confirmedQuantities: Record<SystemId, number>) => {
    if (!complaint) return;

    const newAction: ComplaintAction = {
      id: asSystemId(generateSubEntityId('ACTION')),
      actionType: "verified-correct",
      performedBy: asSystemId(currentUser.systemId),
      performedAt: new Date(),
      note: note ? `Xác nhận khiếu nại đúng: ${note}` : "Xác nhận khiếu nại đúng",
      metadata: {
        confirmedQuantities,
      },
    };
    
    try {
      await updateComplaint(complaint.systemId, {
        verification: "verified-correct",
        isVerifiedCorrect: true,
        timeline: [...(complaint.timeline || []), newAction],
      } as Partial<Complaint>);
      
      toast.success("Đã xác nhận khiếu nại đúng");
      complaintNotifications.onVerified("Đã xác nhận khiếu nại đúng");
    } catch (error) {
      logError('Error verifying complaint', error);
      toast.error('Lỗi khi xác nhận khiếu nại');
    }
  }, [complaint, currentUser, updateComplaint]);

  // ==========================================
  // VERIFY INCORRECT - SUBMIT EVIDENCE
  // ==========================================
  const handleSubmitIncorrectEvidence = React.useCallback(async (
    stagingFiles: Array<{ id: string; sessionId: string }>, 
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
        const _stagingIds = stagingFiles.map(f => f.id);
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
      const newEmployeeImages = confirmedImages.map((url, _idx) => ({
        id: asSystemId(generateSubEntityId('IMG')),
        url,
        uploadedAt: new Date(),
        uploadedBy: currentUser.systemId,
      }));
      
      // ⚠️ CRITICAL: Tìm action verified-correct CUỐI CÙNG để check metadata
      const lastVerifiedCorrect = [...(complaint.timeline || [])]
        .reverse()
        .find(a => a.actionType === 'verified-correct');
      
      const hasPaymentsReceipts = 
        lastVerifiedCorrect?.metadata?.paymentSystemId || 
        lastVerifiedCorrect?.metadata?.receiptSystemId;
      
      const hasInventoryCheck = lastVerifiedCorrect?.metadata?.inventoryCheckSystemId;
      
      
      if (hasPaymentsReceipts || hasInventoryCheck) {
        // Use handler to cancel payments/receipts (phiếu tự động khôi phục kho)
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
          id: asSystemId(generateSubEntityId('ACTION')),
          actionType: "verified-incorrect",
          performedBy: asSystemId(currentUser.systemId),
          performedAt: new Date(),
          note: note || "Đã xác nhận khiếu nại SAI - Có bằng chứng",
          metadata: {
            evidenceImages: confirmedImages,
            evidenceVideos: videoLinks,
          },
        };

        await updateComplaint(complaint.systemId, {
          verification: "verified-incorrect",
          isVerifiedCorrect: false, // ✅ Reset boolean field to match verification enum
          verificationEvidence: {
            images: confirmedImages,
            videos: videoLinks,
            note,
            verifiedBy: currentUser.systemId,
            verifiedAt: new Date(),
          },
          employeeImages: [
            ...(complaint.employeeImages || []),
            ...newEmployeeImages,
          ],
          timeline: [...(complaint.timeline || []), newAction],
        } as Partial<Complaint>);
        
        toast.success("Đã xác nhận khiếu nại sai");
        complaintNotifications.onVerified("Đã xác nhận khiếu nại SAI");
      }
    } catch (error) {
      logError('Error submitting evidence', error);
      toast.error('Lỗi khi upload bằng chứng');
    }
  }, [complaint, updateComplaint, currentUser]);

  return {
    handleConfirmCorrect,
    handleSubmitIncorrectEvidence,
  };
}
