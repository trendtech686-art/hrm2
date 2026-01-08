import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

const TYPE = 'customer-type';

// GET - Get a single customer type
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
      return apiNotFound('CustomerType');
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
    console.error('[Customer Types API] GET by ID error:', error);
    return apiError('Failed to fetch customer type', 500);
  }
}

// PATCH - Update a customer type
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
    console.error('[Customer Types API] PATCH error:', error);
    return apiError('Failed to update customer type', 500);
  }
}

// DELETE - Soft delete a customer type
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
    console.error('[Customer Types API] DELETE error:', error);
    return apiError('Failed to delete customer type', 500);
  }
}
