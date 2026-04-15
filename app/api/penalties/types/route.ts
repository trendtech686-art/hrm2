/**
 * Penalty Types API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { generateNextIds } from '@/lib/id-system';
import { logError } from '@/lib/logger'

// GET /api/penalties/types
export async function GET(_request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const types = await prisma.penaltyTypeSetting.findMany({
      where: { isDeleted: false, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return apiSuccess(types);
  } catch (error) {
    logError('[PenaltyTypes API] GET error', error);
    return apiError('Không thể tải danh sách loại phạt', 500);
  }
}

// POST /api/penalties/types
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const body = await request.json();
    
    const { systemId, businessId } = await generateNextIds('penalties');

    const penaltyType = await prisma.penaltyTypeSetting.create({
      data: {
        systemId,
        id: businessId,
        name: body.name,
        description: body.description,
        defaultAmount: body.defaultAmount || 0,
        category: body.category || 'other',
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder || 0,
        createdBy: session.user.id,
      },
    });

    return apiSuccess(penaltyType, 201);
  } catch (error) {
    logError('[PenaltyTypes API] POST error', error);
    return apiError('Không thể tạo loại phạt', 500);
  }
}
