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
  const { user, employee } = useAuth();
  
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
    const isAdmin = user.role === 'admin';

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
  const isAssignee = complaint.assignedTo === currentUserSystemId;
  const isResponsible = complaint.responsibleUserId === currentUserSystemId;

  // ============================================
  // STATUS-BASED RULES
  // ============================================

  const isPending = complaint.status === 'pending';
  const isInvestigating = complaint.status === 'investigating';
  const isResolved = complaint.status === 'resolved';
  const isCancelled = complaint.status === 'cancelled';
  const isClosed = isResolved || isCancelled;

  // ============================================
  // PERMISSION LOGIC
  // ============================================

  // VIEW: Mọi người đều xem được (trừ khi có logic phân quyền department)
  const canView = true;

  // EDIT: Chỉ creator hoặc admin mới edit được thông tin cơ bản
  // Không edit được khi đã resolved/rejected
  const canEdit = (isCreator || isAdmin) && !isClosed;

  // DELETE: Chỉ admin và chỉ khi còn pending
  const canDelete = isAdmin && isPending;

  // ASSIGN: Chỉ creator hoặc admin
  // Không assign được khi đã resolved/rejected
  const canAssign = (isCreator || isAdmin) && !isClosed;

  // INVESTIGATE: Người được assign hoặc admin
  // Chỉ khi status = investigating
  const canInvestigate = (isAssignee || isAdmin) && isInvestigating;

  // VERIFY: Chỉ assignee (người xử lý) hoặc admin
  // Có thể verify ngay khi status = investigating (không bắt buộc có investigationNote)
  const canVerify = (isAssignee || isAdmin) && 
    (isInvestigating || isPending); // Cho phép verify luôn khi pending hoặc investigating

  // RESOLVE: Chỉ creator (manager) hoặc admin
  // Chỉ khi đã verify
  const canResolve = (isCreator || isAdmin) && 
    isInvestigating &&
    (complaint.verification === 'verified-correct' || complaint.verification === 'verified-incorrect');

  // REJECT: Chỉ creator (manager) hoặc admin
  // Chỉ khi chưa resolved
  const canReject = (isCreator || isAdmin) && !isClosed;

  // CLOSE (Kết thúc): Cho phép đóng khiếu nại khi đã verified
  // Logic: Sau khi verify xong, creator/admin có thể "Kết thúc" để chuyển sang resolved
  const canClose = (isCreator || isAdmin) && 
    !isClosed &&
    complaint.verification !== 'pending-verification';

  // REOPEN: Chỉ admin hoặc creator khi đã đóng
  const canReopen = (isCreator || isAdmin) && isClosed;

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
    } else if (!isCreator) {
      reason = 'Chỉ người tạo khiếu nại mới có thể chỉnh sửa';
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
  }, [user, employee, complaint?.systemId, complaint?.status, complaint?.verification, complaint?.createdBy, complaint?.assignedTo, complaint?.responsibleUserId, complaint?.investigationNote]);
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
