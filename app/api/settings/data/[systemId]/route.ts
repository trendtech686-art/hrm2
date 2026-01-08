import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { updateSettingsDataSchema, deleteSettingsDataSchema } from './validation';

type RouteContext = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single settings data by systemId
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await context.params;

  try {
    const setting = await prisma.settingsData.findUnique({
      where: { systemId },
    });

    if (!setting) {
      return apiError('Settings data not found', 404);
    }

    return apiSuccess({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      isActive: setting.isActive,
      isDefault: setting.isDefault,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      createdBy: setting.createdBy,
      updatedBy: setting.updatedBy,
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Settings Data API] GET by ID error:', error);
    return apiError('Failed to fetch settings data', 500);
  }
}

// PATCH - Update settings data
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await context.params;

  const validation = await validateBody(request, updateSettingsDataSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }
  const { 
    id, 
    name, 
    description,
    isActive,
    isDefault,
    updatedBy,
    ...extraFields 
  } = validation.data;

  try {
    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return apiError('Settings data not found', 404);
    }

    // Merge existing metadata with new extra fields
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    const newMetadata = { ...existingMetadata, ...extraFields };

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        ...(id !== undefined && { id }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
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
      isActive: updated.isActive,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      createdBy: updated.createdBy,
      updatedBy: updated.updatedBy,
      ...(updated.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Settings Data API] PATCH error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return apiError('A setting with this ID already exists for this type', 409);
    }

    return apiError('Failed to update settings data', 500);
  }
}

// DELETE - Soft delete settings data
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await context.params;

  try {
    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return apiError('Settings data not found', 404);
    }

    const validation = await validateBody(request, deleteSettingsDataSchema).catch(() => ({ success: true, data: {} as { hard?: boolean } }));
    const hard = validation.success && validation.data?.hard === true;

    if (hard) {
      await prisma.settingsData.delete({
        where: { systemId },
      });
    } else {
      await prisma.settingsData.update({
        where: { systemId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Settings Data API] DELETE error:', error);
    return apiError('Failed to delete settings data', 500);
  }
}
