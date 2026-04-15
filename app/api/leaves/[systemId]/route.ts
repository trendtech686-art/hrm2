/**
 * Leave Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound, serializeDecimals } from '@/lib/api-utils'
import { LeaveStatus } from '@/generated/prisma/client'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// Status mapping from Vietnamese to enum
const statusToEnum: Record<string, LeaveStatus> = {
  'Chờ duyệt': 'PENDING',
  'Đã duyệt': 'APPROVED',
  'Đã từ chối': 'REJECTED',
  'Từ chối': 'REJECTED',
  'Đã hủy': 'CANCELLED',
};

// Status mapping from enum to Vietnamese
const statusToVietnamese: Record<string, string> = {
  'PENDING': 'Chờ duyệt',
  'APPROVED': 'Đã duyệt',
  'REJECTED': 'Đã từ chối',
  'CANCELLED': 'Đã hủy',
};

// Transform leave data to include Vietnamese status
const transformLeave = (leave: Record<string, unknown>) => ({
  ...leave,
  status: statusToVietnamese[leave.status as string] || leave.status,
});

// GET - Get single leave
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const leave = await prisma.leave.findUnique({
      where: { systemId },
      include: {
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!leave) {
      return apiNotFound('Leave request');
    }

    return apiSuccess(serializeDecimals(transformLeave(leave as unknown as Record<string, unknown>)));
  } catch (error) {
    logError('[Leaves API] GET by ID error', error);
    return apiError('Failed to fetch leave request', 500);
  }
}

// PATCH - Update leave (approve/reject)
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const {
      status,
      approvedBy,
      reason,
      rejectionReason,
      updatedBy,
    } = body;

    const updateData: Parameters<typeof prisma.leave.update>[0]['data'] = {
      updatedAt: new Date(),
    };
    
    // Map Vietnamese status to enum
    if (status !== undefined) {
      updateData.status = statusToEnum[status] || status as LeaveStatus;
    }
    if (reason !== undefined) updateData.reason = reason;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
    if (updatedBy !== undefined) updateData.updatedBy = updatedBy;
    
    // If approving, set approvedBy and approvedAt
    const isApproving = status === 'Đã duyệt' || status === 'APPROVED' || status === 'approved';
    if (isApproving && approvedBy) {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
    }
    
    // If rejecting, set rejectedBy and rejectedAt
    const isRejecting = status === 'Đã từ chối' || status === 'Từ chối' || status === 'REJECTED' || status === 'rejected';
    if (isRejecting) {
      updateData.rejectedAt = new Date();
    }

    const leave = await prisma.leave.update({
      where: { systemId },
      data: updateData,
      include: {
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Notify employee when leave is approved/rejected (non-blocking)
    if ((isApproving || isRejecting) && leave.employee?.systemId) {
      const statusMsg = isApproving ? 'đã được duyệt ✅' : 'đã bị từ chối ❌';
      createNotification({
        type: 'leave',
        settingsKey: 'leave:updated',
        title: `Đơn nghỉ phép ${isApproving ? 'được duyệt' : 'bị từ chối'}`,
        message: `Đơn xin nghỉ phép của bạn ${statusMsg}`,
        link: '/leaves',
        recipientId: leave.employee.systemId,
        senderId: session.user?.employeeId || undefined,
        senderName: session.user?.name || undefined,
      }).catch(e => logError('[Leaves] Approval notification failed', e));
    }

    return apiSuccess(serializeDecimals(transformLeave(leave as unknown as Record<string, unknown>)));
  } catch (error) {
    logError('[Leaves API] PATCH error', error);
    return apiError('Failed to update leave request', 500);
  }
}

// DELETE - Soft or hard delete leave
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    if (hard) {
      await prisma.leave.delete({
        where: { systemId },
      });
    } else {
      // Leave has no soft delete fields, use hard delete
      await prisma.leave.delete({
        where: { systemId },
      });
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'leave',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa đơn nghỉ phép`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] leave delete failed', e))
    return apiSuccess({ success: true });
  } catch (error) {
    logError('[Leaves API] DELETE error', error);
    return apiError('Failed to delete leave request', 500);
  }
}
