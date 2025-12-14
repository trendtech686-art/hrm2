/**
 * Compensation Handlers Hook
 * Handles compensation payment/receipt creation and processing
 */

import * as React from 'react';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import type { SystemId } from '@/lib/id-types';
import { complaintNotifications } from '../notification-utils';
import type { Complaint, ComplaintAction } from '../types';
import type { CompensationResult } from '../compensation-payment-receipt-wizard';

interface UseCompensationHandlersProps {
  complaint: Complaint | null;
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => void;
  currentUser: { systemId: SystemId; name: string };
}

export function useCompensationHandlers({
  complaint,
  updateComplaint,
  currentUser,
}: UseCompensationHandlersProps) {
  
  // ==========================================
  // PROCESS COMPENSATION BUTTON
  // ==========================================
  const handleProcessCompensation = React.useCallback(() => {
    if (!complaint) return;
    
    if (complaint.verification !== "verified-correct") {
      toast.error("Vui lòng xác nhận khiếu nại đúng trước khi xử lý bù trừ");
      return false;
    }
    
    return true; // Allow opening dialog
  }, [complaint]);

  // ==========================================
  // COMPENSATION COMPLETE CALLBACK
  // ==========================================
  const handleCompensationComplete = React.useCallback((result: CompensationResult) => {
    if (!complaint) return;

    // ⚠️ CRITICAL: Tìm action verified-correct CUỐI CÙNG trong timeline và update metadata
    const updatedTimeline = [...complaint.timeline];
    const lastVerifiedCorrectIndex = updatedTimeline
      .map((a, i) => ({ action: a, index: i }))
      .reverse()
      .find(({ action }) => action.actionType === 'verified-correct')?.index;
    
    if (lastVerifiedCorrectIndex !== undefined) {
      updatedTimeline[lastVerifiedCorrectIndex] = {
        ...updatedTimeline[lastVerifiedCorrectIndex],
        metadata: {
          ...updatedTimeline[lastVerifiedCorrectIndex].metadata,
          paymentSystemId: result.payment?.systemId,
          penaltySystemIds: result.penalties?.map(p => p.systemId),
          inventoryCheckSystemId: result.inventoryCheckSystemId,
        },
      };
    }

    // Thêm action mới cho "Xử lý bù trừ"
    const compensationDetails: string[] = [];
    if (result.payment) {
      compensationDetails.push(`Phiếu chi: ${result.payment.id} (${result.payment.amount.toLocaleString('vi-VN')} đ)`);
    }
    if (result.penalties && result.penalties.length > 0) {
      result.penalties.forEach(penalty => {
        compensationDetails.push(`Phiếu phạt: ${penalty.id} - ${penalty.penaltyTypeName || 'Phạt'} (${penalty.amount.toLocaleString('vi-VN')} đ)`);
      });
    }
    if (result.inventoryCheckSystemId) {
      compensationDetails.push(`Phiếu kiểm kê: ${result.inventoryCheckSystemId}`);
    }
    
    const compensationAction: ComplaintAction = {
      id: asSystemId(`action_${Date.now()}`),
      actionType: "commented" as const,
      performedBy: asSystemId(currentUser.systemId),
      performedAt: new Date(),
      note: `Xử lý bù trừ: ${result.reason}\n${compensationDetails.join('\n')}`,
    };
    
    updatedTimeline.push(compensationAction);

    // Calculate total penalty amount
    const totalPenaltyAmount = result.penalties?.reduce((sum, p) => sum + p.amount, 0) || 0;

    updateComplaint(complaint.systemId, {
      isVerifiedCorrect: true,
      verification: "verified-correct",
      resolution: result.payment?.description?.includes('Đổi hàng') ? "replacement" : "refund",
      resolutionNote: result.reason,
      compensationAmount: result.payment?.amount || 0,
      penaltyAmount: totalPenaltyAmount,
      compensationReason: result.reason,
      timeline: updatedTimeline,
      // ⚠️ REMOVED: Không cập nhật compensationMetadata nữa
      // Mỗi action tự lưu metadata của riêng nó
    } as any);

    complaintNotifications.onVerified("Đã xác nhận khiếu nại đúng, ghi nhận giải pháp và tạo phiếu chi");
    toast.success("Đã tạo phiếu bù trừ thành công!");
  }, [complaint, updateComplaint, currentUser]);

  return {
    handleProcessCompensation,
    handleCompensationComplete,
  };
}
