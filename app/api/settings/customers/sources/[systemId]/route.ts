import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'customer-source';

// GET - Get a single customer source
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
      return apiNotFound('CustomerSource');
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
    logError('[Customer Sources API] GET by ID error', error);
    return apiError('Failed to fetch customer source', 500);
  }
}

// PATCH - Update a customer source
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await params;
  try {
    const body = await request.json();
    const { id, name, description, color, isDefault, isActive, orderIndex, ...rest } = body;

    const existing = await prisma.customerSetting.findUnique({ where: { systemId } });
    if (!existing || existing.isDeleted) return apiNotFound('CustomerSource');

    const setting = await prisma.customerSetting.update({
      where: { systemId },
      data: {
        ...(id !== undefined && { id }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(Object.keys(rest).length > 0 && { metadata: rest }),
      },
    });

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (name !== undefined && name !== existing.name) changes['Tên'] = { from: existing.name, to: name }
    if (description !== undefined && description !== existing.description) changes['Mô tả'] = { from: existing.description, to: description }
    if (color !== undefined && color !== existing.color) changes['Màu'] = { from: existing.color, to: color }
    if (isDefault !== undefined && isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: isDefault ? 'Có' : 'Không' }
    if (isActive !== undefined && isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: isActive ? 'Hoạt động' : 'Ngừng' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'customer_source',
        entityId: systemId,
        action: `Cập nhật nguồn khách hàng: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
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
    logError('[Customer Sources API] PATCH error', error);
    return apiError('Failed to update customer source', 500);
  }
}

// DELETE - Soft delete a customer source
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await params;
  try {
    const existing = await prisma.customerSetting.findUnique({ where: { systemId } });

    await prisma.customerSetting.update({
      where: { systemId },
      data: { isDeleted: true },
    });

    if (existing) {
      createActivityLog({
        entityType: 'customer_source',
        entityId: systemId,
        action: `Xóa nguồn khách hàng: ${existing.name}`,
        actionType: 'delete',
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess(null, 204);
  } catch (error) {
    logError('[Customer Sources API] DELETE error', error);
    return apiError('Failed to delete customer source', 500);
  }
}
