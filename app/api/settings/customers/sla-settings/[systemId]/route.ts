import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'sla-setting';

// GET - Get a single SLA setting
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
      return apiNotFound('SlaSetting');
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
    logError('[SLA Settings API] GET by ID error', error);
    return apiError('Failed to fetch SLA setting', 500);
  }
}

// PATCH - Update an SLA setting
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

    const existing = await prisma.customerSetting.findUnique({ where: { systemId } });
    if (!existing || existing.isDeleted) return apiNotFound('SlaSetting');

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

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (name !== undefined && name !== existing.name) changes['Tên'] = { from: existing.name, to: name }
    if (description !== undefined && description !== existing.description) changes['Mô tả'] = { from: existing.description, to: description }
    if (color !== undefined && color !== existing.color) changes['Màu sắc'] = { from: existing.color, to: color }
    if (isDefault !== undefined && isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault, to: isDefault }
    if (isActive !== undefined && isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive, to: isActive }

    if (Object.keys(changes).length > 0) {
      await createActivityLog({
        entityType: 'customer_sla',
        entityId: systemId,
        action: `Cập nhật SLA: ${existing.name}`,
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
    logError('[SLA Settings API] PATCH error', error);
    return apiError('Failed to update SLA setting', 500);
  }
}

// DELETE - Soft delete an SLA setting
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
      await createActivityLog({
        entityType: 'customer_sla',
        entityId: systemId,
        action: `Xóa SLA: ${existing.name}`,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess(null, 204);
  } catch (error) {
    logError('[SLA Settings API] DELETE error', error);
    return apiError('Failed to delete SLA setting', 500);
  }
}
