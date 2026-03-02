/**
 * Single Penalty API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

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
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    
    const penalty = await prisma.penalty.findUnique({
      where: { systemId },
    });

    if (!penalty) {
      return apiNotFound('Penalty');
    }

    return apiSuccess(serializePenalty(penalty as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('[Penalties API] GET by ID error:', error);
    return apiError('Failed to fetch penalty', 500);
  }
}

// PATCH /api/penalties/[systemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

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

    return apiSuccess(serializePenalty(penalty as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('[Penalties API] PATCH error:', error);
    return apiError('Failed to update penalty', 500);
  }
}

// DELETE /api/penalties/[systemId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    
    await prisma.penalty.delete({
      where: { systemId },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Penalties API] DELETE error:', error);
    return apiError('Failed to delete penalty', 500);
  }
}
