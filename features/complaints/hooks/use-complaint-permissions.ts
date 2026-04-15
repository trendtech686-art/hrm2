/**
 * ============================================
 * COMPLAINT PERMISSION HOOK
 * ============================================
 * Kiểm tra quyền hạn cho các thao tác với khiếu nại
 * Sử dụng systemId thay vì id để xử lý nội bộ
 */

import * as React from 'react';
import { useAuth } from '../../../contexts/auth-context';
import type { Complaint } from '../types';

export interface ComplaintPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  canVerify: boolean;
  canResolve: boolean;
  canReject: boolean;
  canComment: boolean;
  canInvestigate: boolean;
  canClose: boolean;
  canReopen: boolean;
  reason?: string; // Lý do không có quyền (để hiển thị cho user)
}

/**
 * Hook kiểm tra quyền cho khiếu nại
 * @param complaint - Khiếu nại cần kiểm tra quyền
 * @returns Object chứa các quyền hạn
 */
export function useComplaintPermissions(complaint?: Complaint | null): ComplaintPermissions {
  const { user, employee, isAdmin } = useAuth();
  
  return React.useMemo(() => {
    // Không có user → không có quyền gì
    if (!user || !employee) {
      return {
        canView: false,
        canEdit: false,
        canDelete: false,
        canAssign: false,
        canVerify: false,
        canResolve: false,
        canReject: false,
        canComment: false,
        canInvestigate: false,
        canClose: false,
        canReopen: false,
        reason: 'Bạn chưa đăng nhập',
      };
    }

    const currentUserSystemId = employee.systemId; // ⭐ Dùng systemId của employee
    // isAdmin is now from useAuth() hook directly

    // Không có complaint → chỉ cho phép view danh sách
    if (!complaint) {
      return {
        canView: true,
        canEdit: false,
        canDelete: false,
        canAssign: isAdmin,
        canVerify: isAdmin,
        canResolve: isAdmin,
        canReject: isAdmin,
        canComment: true,
        canInvestigate: false,
        canClose: isAdmin,
        canReopen: isAdmin,
      };
    }

  // ============================================
  // ROLE-BASED PERMISSIONS
  // ============================================

  const isCreator = complaint.createdBy === currentUserSystemId;
  // Support both assignedTo (mapped) and assigneeId (raw Prisma)
  const isAssignee = (complaint.assignedTo === currentUserSystemId) || 
    ((complaint as unknown as { assigneeId?: string }).assigneeId === currentUserSystemId);
  const isResponsible = complaint.responsibleUserId === currentUserSystemId;

  // ============================================
  // STATUS-BASED RULES
  // ============================================
  // Support both Prisma enum (uppercase) and legacy app types (lowercase)
  const statusLower = complaint.status?.toLowerCase?.() || complaint.status;
  
  const isPending = statusLower === 'pending' || statusLower === 'open';
  const isInvestigating = statusLower === 'investigating' || statusLower === 'in_progress';
  const isResolved = statusLower === 'resolved';
  const isCancelled = statusLower === 'cancelled' || statusLower === 'closed';
  const isEnded = statusLower === 'ended';
  const isClosed = isResolved || isCancelled || isEnded;

  // ============================================
  // PERMISSION LOGIC
  // ============================================

  // VIEW: Mọi người đều xem được (trừ khi có logic phân quyền department)
  const canView = true;

  // EDIT: Chỉ admin mới edit được thông tin cơ bản
  // Không edit được khi đã resolved/rejected
  const canEdit = isAdmin && !isClosed;

  // DELETE: Chỉ admin và chỉ khi còn pending
  const canDelete = isAdmin && isPending;

  // ASSIGN: Chỉ admin
  const canAssign = isAdmin && !isClosed;

  // INVESTIGATE: Chỉ admin
  const canInvestigate = isAdmin && isInvestigating;

  // VERIFY: Assignee (người xử lý) hoặc admin có thể verify
  // Nếu chưa assign thì creator có quyền verify
  // Có thể verify ngay khi status = investigating hoặc pending (OPEN)
  const hasNoAssignee = !complaint.assignedTo && !(complaint as unknown as { assigneeId?: string }).assigneeId;
  const canVerify = (isAssignee || isAdmin || (isCreator && hasNoAssignee)) && 
    (isInvestigating || isPending); // Cho phép verify luôn khi pending hoặc investigating

  // RESOLVE: Chỉ admin
  const canResolve = isAdmin && 
    isInvestigating &&
    (complaint.verification === 'verified-correct' || complaint.verification === 'verified-incorrect');

  // REJECT (Hủy): Chỉ admin
  const canReject = isAdmin && !isClosed;

  // CLOSE (Kết thúc): Chỉ admin, khi đã verified
  const canClose = isAdmin && 
    !isClosed &&
    complaint.verification !== 'pending-verification';

  // REOPEN: Chỉ admin khi đã đóng
  const canReopen = isAdmin && isClosed;

  // COMMENT: Mọi người liên quan (creator, assignee, responsible, admin)
  const canComment = isCreator || isAssignee || isResponsible || isAdmin;

  // ============================================
  // REASON MESSAGE
  // ============================================

  let reason: string | undefined;
  
  if (!canView) {
    reason = 'Bạn không có quyền xem khiếu nại này';
  } else if (!canEdit && !isAdmin) {
    if (isClosed) {
      reason = 'Không thể chỉnh sửa khiếu nại đã đóng';
    } else {
      reason = 'Chỉ quản trị viên mới có thể thao tác';
    }
  }

  const permissions: ComplaintPermissions = {
    canView,
    canEdit,
    canDelete,
    canAssign,
    canVerify,
    canResolve,
    canReject,
    canComment,
    canInvestigate,
    canClose,
    canReopen,
  };

  if (reason) {
    permissions.reason = reason;
  }

  return permissions;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally tracking specific complaint properties only
  }, [user, employee, isAdmin, complaint?.systemId, complaint?.status, complaint?.verification, complaint?.createdBy, complaint?.assignedTo, complaint?.responsibleUserId, complaint?.investigationNote]);
}

/**
 * Helper function: Kiểm tra quyền nhanh (không cần hook)
 */
export function checkComplaintPermission(
  complaint: Complaint | null | undefined,
  currentUserSystemId: string,
  isAdmin: boolean,
  action: keyof ComplaintPermissions
): boolean {
  if (!complaint) return false;

  const isCreator = complaint.createdBy === currentUserSystemId;
  const isAssignee = complaint.assignedTo === currentUserSystemId;
  const isClosed = complaint.status === 'resolved' || complaint.status === 'cancelled';

  switch (action) {
    case 'canView':
      return true;
    
    case 'canEdit':
      return (isCreator || isAdmin) && !isClosed;
    
    case 'canDelete':
      return isAdmin && complaint.status === 'pending';
    
    case 'canAssign':
      return (isCreator || isAdmin) && !isClosed;
    
    case 'canVerify':
      return (isAssignee || isAdmin) && 
        (complaint.status === 'investigating' || complaint.status === 'pending');
    
    case 'canResolve':
      return (isCreator || isAdmin) && 
        complaint.status === 'investigating' &&
        (complaint.verification === 'verified-correct' || complaint.verification === 'verified-incorrect');
    
    case 'canReject':
      return (isCreator || isAdmin) && !isClosed;
    
    case 'canInvestigate':
      return (isAssignee || isAdmin) && complaint.status === 'investigating';
    
    case 'canComment':
      return isCreator || isAssignee || isAdmin;
    
    case 'canClose':
      return (isCreator || isAdmin) && !isClosed;
      
    case 'canReopen':
      return (isCreator || isAdmin) && isClosed;
    
    default:
      return false;
  }
}
