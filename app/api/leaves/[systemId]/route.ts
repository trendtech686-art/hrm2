/**
 * Leave Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { LeaveStatus } from '@/generated/prisma/client'

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

    return apiSuccess(transformLeave(leave as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('[Leaves API] GET by ID error:', error);
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

    return apiSuccess(transformLeave(leave as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('[Leaves API] PATCH error:', error);
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

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Leaves API] DELETE error:', error);
    return apiError('Failed to delete leave request', 500);
  }
}
