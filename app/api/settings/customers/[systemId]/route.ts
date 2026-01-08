import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { updateCustomerSettingSchema, deleteCustomerSettingSchema } from './validation';

type RouteContext = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single customer setting by systemId
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await context.params;

  try {
    const setting = await prisma.customerSetting.findUnique({
      where: { systemId },
    });

    if (!setting) {
      return apiError('Customer setting not found', 404);
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
      createdBy: setting.createdBy,
      updatedBy: setting.updatedBy,
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Customer Settings API] GET by ID error:', error);
    return apiError('Failed to fetch customer setting', 500);
  }
}

// PATCH - Update customer setting
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await context.params;

  const validation = await validateBody(request, updateCustomerSettingSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }
  const { 
    id, 
    name, 
    description, 
    color, 
    isDefault, 
    isActive,
    orderIndex,
    updatedBy,
    ...extraFields 
  } = validation.data;

  try {
    // Check if exists
    const existing = await prisma.customerSetting.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return apiError('Customer setting not found', 404);
    }

    // Merge existing metadata with new extra fields
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    const newMetadata = { ...existingMetadata, ...extraFields };

    const updated = await prisma.customerSetting.update({
      where: { systemId },
      data: {
        ...(id !== undefined && { id }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(Object.keys(extraFields).length > 0 && { metadata: newMetadata as Prisma.InputJsonValue }),
        updatedBy,
      },
    });

    return apiSuccess({
      systemId: updated.systemId,
      id: updated.id,
      name: updated.name,
      type: updated.type,
      description: updated.description,
      color: updated.color,
      isDefault: updated.isDefault,
      isActive: updated.isActive,
      orderIndex: updated.orderIndex,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      createdBy: updated.createdBy,
      updatedBy: updated.updatedBy,
      ...(updated.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Customer Settings API] PATCH error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return apiError('A setting with this ID already exists for this type', 409);
    }

    return apiError('Failed to update customer setting', 500);
  }
}

// DELETE - Soft delete customer setting
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await context.params;

  try {
    // Check if exists
    const existing = await prisma.customerSetting.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return apiError('Customer setting not found', 404);
    }

    // Check request body for hard delete flag
    const validation = await validateBody(request, deleteCustomerSettingSchema).catch(() => ({ success: true, data: {} as { hard?: boolean } }));
    const hard = validation.success && validation.data?.hard === true;

    if (hard) {
      await prisma.customerSetting.delete({
        where: { systemId },
      });
    } else {
      await prisma.customerSetting.update({
        where: { systemId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Customer Settings API] DELETE error:', error);
    return apiError('Failed to delete customer setting', 500);
  }
}
