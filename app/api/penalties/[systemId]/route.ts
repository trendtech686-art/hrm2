/**
 * Single Penalty API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Helper: normalize English status to Vietnamese display status
function mapPenaltyStatus(status: string): string {
  switch (status) {
    case 'pending': return 'Chưa thanh toán';
    case 'paid':
    case 'DEDUCTED': return 'Đã thanh toán';
    case 'cancelled': return 'Đã hủy';
    case 'Chưa thanh toán':
    case 'Đã thanh toán':
    case 'Đã hủy':
      return status;
    default: return status;
  }
}

// Helper to serialize Decimal fields and map Prisma fields to frontend types
function serializePenalty(p: Record<string, unknown>) {
  return {
    ...p,
    // Map Prisma field names to frontend type names
    employeeSystemId: p.employeeId ?? p.employeeSystemId,
    penaltyTypeSystemId: p.penaltyTypeId ?? p.penaltyTypeSystemId,
    issueDate: p.date ?? p.issueDate,
    // Normalize status
    status: mapPenaltyStatus(String(p.status || 'Chưa thanh toán')),
    // Convert Decimal to number
    amount: typeof p.amount === 'object' && p.amount !== null && 'toNumber' in (p.amount as object)
      ? (p.amount as { toNumber(): number }).toNumber()
      : Number(p.amount),
  };
}

// GET /api/penalties/[systemId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const { systemId } = await params;
    
    const penalty = await prisma.penalty.findUnique({
      where: { systemId },
    });

    if (!penalty) {
      return apiNotFound('Phiếu phạt');
    }

    return apiSuccess(serializePenalty(penalty as unknown as Record<string, unknown>));
  } catch (error) {
    logError('[Penalties API] GET by ID error', error);
    return apiError('Không thể tải phiếu phạt', 500);
  }
}

// PATCH /api/penalties/[systemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const penalty = await prisma.penalty.update({
      where: { systemId },
      data: {
        employeeId: body.employeeId,
        employeeName: body.employeeName,
        penaltyTypeId: body.penaltyTypeId,
        penaltyTypeName: body.penaltyTypeName,
        amount: body.amount,
        reason: body.reason,
        date: body.date ? new Date(body.date) : undefined,
        status: body.status,
        category: body.category,
        linkedComplaintSystemId: body.linkedComplaintSystemId,
        linkedOrderSystemId: body.linkedOrderSystemId,
        isApplied: body.isApplied,
        deductedInPayrollId: body.deductedInPayrollId,
        deductedAt: body.deductedAt ? new Date(body.deductedAt) : undefined,
        updatedBy: session.user.id,
      },
    });

    // Notify penalized employee about update
    if (penalty.employeeId && penalty.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'penalty',
        settingsKey: 'penalty:updated',
        title: 'Kỷ luật được cập nhật',
        message: `Phiếu kỷ luật ${penalty.id || systemId} đã được cập nhật`,
        link: `/penalties/${systemId}`,
        recipientId: penalty.employeeId as string,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Penalty Update] notification failed', e));
    }

    return apiSuccess(serializePenalty(penalty as unknown as Record<string, unknown>));
  } catch (error) {
    logError('[Penalties API] PATCH error', error);
    return apiError('Không thể cập nhật phiếu phạt', 500);
  }
}

// DELETE /api/penalties/[systemId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const { systemId } = await params;
    
    await prisma.penalty.delete({
      where: { systemId },
    });

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'penalty',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu phạt`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] penalty delete failed', e))
    return apiSuccess({ success: true });
  } catch (error) {
    logError('[Penalties API] DELETE error', error);
    return apiError('Không thể xóa phiếu phạt', 500);
  }
}
