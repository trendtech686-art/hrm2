import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

const TYPE = 'credit-rating';

// GET - Get a single credit rating
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await params;
  try {
    const setting = await prisma.customerSetting.findUnique({
      where: { systemId, type: TYPE },
    });

    if (!setting || setting.isDeleted) {
      return apiNotFound('CreditRating');
    }

    return apiSuccess({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      color: setting.color,
      isDefault: setting.isDefault,
      isActive: setting.isActive,
      orderIndex: setting.orderIndex,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Credit Ratings API] GET by ID error:', error);
    return apiError('Failed to fetch credit rating', 500);
  }
}

// PATCH - Update a credit rating
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await params;
  try {
    const body = await request.json();
    const { name, description, color, isDefault, isActive, orderIndex, ...rest } = body;

    const setting = await prisma.customerSetting.update({
      where: { systemId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(Object.keys(rest).length > 0 && { metadata: rest }),
      },
    });

    return apiSuccess({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      color: setting.color,
      isDefault: setting.isDefault,
      isActive: setting.isActive,
      orderIndex: setting.orderIndex,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Credit Ratings API] PATCH error:', error);
    return apiError('Failed to update credit rating', 500);
  }
}

// DELETE - Soft delete a credit rating
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await params;
  try {
    await prisma.customerSetting.update({
      where: { systemId },
      data: { isDeleted: true },
    });

    return apiSuccess(null, 204);
  } catch (error) {
    console.error('[Credit Ratings API] DELETE error:', error);
    return apiError('Failed to delete credit rating', 500);
  }
}
