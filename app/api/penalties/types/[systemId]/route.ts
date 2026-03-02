/**
 * Single Penalty Type API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

// GET /api/penalties/types/[systemId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    
    const penaltyType = await prisma.penaltyTypeSetting.findUnique({
      where: { systemId },
    });

    if (!penaltyType || penaltyType.isDeleted) {
      return apiNotFound('Penalty Type');
    }

    return apiSuccess(penaltyType);
  } catch (error) {
    console.error('[PenaltyTypes API] GET by ID error:', error);
    return apiError('Failed to fetch penalty type', 500);
  }
}

// PATCH /api/penalties/types/[systemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const penaltyType = await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
        defaultAmount: body.defaultAmount,
        category: body.category,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
        updatedBy: session.user.id,
      },
    });

    return apiSuccess(penaltyType);
  } catch (error) {
    console.error('[PenaltyTypes API] PATCH error:', error);
    return apiError('Failed to update penalty type', 500);
  }
}

// DELETE /api/penalties/types/[systemId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

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
    console.error('[PenaltyTypes API] DELETE error:', error);
    return apiError('Failed to delete penalty type', 500);
  }
}
