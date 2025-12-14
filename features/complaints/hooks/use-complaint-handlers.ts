/**
 * Complaint Handlers Hook
 * Handles basic complaint operations: assign, status change, end, cancel, reopen
 */

import * as React from 'react';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '@/lib/id-types';
import type { Complaint, ComplaintAction } from '../types';
import type { ComplaintPermissions } from './use-complaint-permissions';
import { complaintNotifications } from '../notification-utils';

interface UseComplaintHandlersProps {
  complaint: Complaint | null;
  currentUser: { systemId: SystemId; name: string };
  permissions: ComplaintPermissions;
  assignComplaint: (systemId: SystemId, userId: SystemId, userName?: string) => void;
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => void;
}

export function useComplaintHandlers({
  complaint,
  currentUser,
  permissions,
  assignComplaint,
  updateComplaint,
}: UseComplaintHandlersProps) {
  
  // ==========================================
  // ASSIGN HANDLER
  // ==========================================
  const handleAssign = React.useCallback((userId: string, userName: string) => {
    if (!complaint) return;
    
    if (!permissions.canAssign) {
      toast.error(permissions.reason || "Bạn không có quyền gán khiếu nại");
      return;
    }
    
    // ⚠️ NOTE: assignComplaint (from store) already creates timeline action
    // So we don't need to create another one here
    assignComplaint(complaint.systemId, asSystemId(userId), userName);
    complaintNotifications.onAssign();
  }, [complaint, permissions, assignComplaint]);

  // ==========================================
  // STATUS CHANGE HANDLER
  // ==========================================
  const handleStatusChange = React.useCallback((newStatus: Complaint['status'], reason?: string) => {
    if (!complaint) return;
    
    // Tạo timeline action
    const newAction: ComplaintAction = {
      id: asSystemId(`action_${Date.now()}`),
      actionType: "status-changed",
      performedBy: currentUser.systemId,
      performedAt: new Date(),
      note: reason || `Đổi trạng thái sang ${newStatus}`,
      metadata: {
        oldStatus: complaint.status,
        newStatus: newStatus,
      },
    };
    
    updateComplaint(complaint.systemId, { 
      status: newStatus,
      timeline: [...complaint.timeline, newAction],
    } as any);
    
    toast.success("Đã cập nhật trạng thái");
  }, [complaint, updateComplaint, currentUser]);

  // ==========================================
  // END COMPLAINT HANDLER
  // ==========================================
  const handleEndComplaint = React.useCallback(() => {
    if (!complaint) return;
    if (complaint.verification === "pending-verification") {
      toast.error("Vui lòng xác minh khiếu nại trước khi kết thúc");
      return;
    }
    
    const newAction: ComplaintAction = {
      id: asSystemId(`action_${Date.now()}`),
      actionType: "ended",
      performedBy: currentUser.systemId,
      performedAt: new Date(),
      note: "Kết thúc khiếu nại",
    };
    
    updateComplaint(complaint.systemId, {
      status: "resolved",
      endedBy: currentUser.systemId,
      endedAt: new Date(),
      timeline: [...complaint.timeline, newAction],
    } as any);
    
    complaintNotifications.onResolved("Đã kết thúc khiếu nại");
  }, [complaint, updateComplaint, currentUser]);

  return {
    handleAssign,
    handleStatusChange,
    handleEndComplaint,
  };
}
