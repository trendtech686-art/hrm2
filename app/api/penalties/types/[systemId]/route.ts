/**
 * Single Penalty Type API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/penalties/types/[systemId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const { systemId } = await params;
    
    const penaltyType = await prisma.penaltyTypeSetting.findUnique({
      where: { systemId },
    });

    if (!penaltyType || penaltyType.isDeleted) {
      return apiNotFound('Loại phạt');
    }

    return apiSuccess(penaltyType);
  } catch (error) {
    logError('[PenaltyTypes API] GET by ID error', error);
    return apiError('Không thể tải loại phạt', 500);
  }
}

// PATCH /api/penalties/types/[systemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    // Read existing for diff
    const existing = await prisma.penaltyTypeSetting.findUnique({
      where: { systemId },
    });
    if (!existing || existing.isDeleted) {
      return apiNotFound('Loại phạt');
    }

    const penaltyType = await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.defaultAmount !== undefined && { defaultAmount: body.defaultAmount }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        updatedBy: session.user.id,
      },
    });

    // Activity log with diff
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description ?? '', to: body.description ?? '' }
    if (body.defaultAmount !== undefined && body.defaultAmount !== existing.defaultAmount) changes['Số tiền phạt'] = { from: existing.defaultAmount, to: body.defaultAmount }
    if (body.category !== undefined && body.category !== existing.category) changes['Danh mục'] = { from: existing.category, to: body.category }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'penalty_type',
        entityId: systemId,
        action: `Cập nhật loại phạt: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('[penalty-types] activity log failed', e))
    }

    return apiSuccess(penaltyType);
  } catch (error) {
    logError('[PenaltyTypes API] PATCH error', error);
    return apiError('Không thể cập nhật loại phạt', 500);
  }
}

// DELETE /api/penalties/types/[systemId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const { systemId } = await params;
    
    // Soft delete
    await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: session.user.id,
      },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    logError('[PenaltyTypes API] DELETE error', error);
    return apiError('Không thể xóa loại phạt', 500);
  }
}
