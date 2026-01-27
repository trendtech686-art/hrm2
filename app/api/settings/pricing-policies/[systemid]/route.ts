import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { z } from 'zod';

const TYPE = 'pricing-policy';

const updatePricingPolicySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['Nhập hàng', 'Bán hàng']).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// GET - Get single pricing policy
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ systemid: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemid } = await params;
    const setting = await prisma.settingsData.findFirst({
      where: { systemId: systemid, type: TYPE, isDeleted: false },
    });

    if (!setting) {
      return apiError('Pricing policy not found', 404);
    }

    return apiSuccess({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      isDefault: setting.isDefault,
      isActive: setting.isActive,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Pricing Policy API] GET error:', error);
    return apiError('Failed to fetch pricing policy', 500);
  }
}

// PATCH - Update pricing policy
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemid: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, updatePricingPolicySchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  try {
    const { systemid } = await params;
    const existing = await prisma.settingsData.findFirst({
      where: { systemId: systemid, type: TYPE, isDeleted: false },
    });

    if (!existing) {
      return apiError('Pricing policy not found', 404);
    }

    const { id, name, description, type, isDefault, isActive } = validation.data;

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      const policyType = type ?? (existing.metadata as any)?.type;
      await prisma.settingsData.updateMany({
        where: {
          systemId: { not: systemid },
          type: TYPE,
          isDeleted: false,
          metadata: {
            path: ['type'],
            equals: policyType,
          },
        },
        data: { isDefault: false },
      });
    }

    // Build update data
    const updateData: Prisma.SettingsDataUpdateInput = {
      updatedBy: session.user.id,
    };

    if (id !== undefined) updateData.id = id;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update metadata if type changed
    if (type !== undefined) {
      updateData.metadata = {
        ...(existing.metadata as Record<string, unknown> || {}),
        type,
      } as Prisma.InputJsonValue;
    }

    const updated = await prisma.settingsData.update({
      where: { systemId: systemid },
      data: updateData,
    });

    return apiSuccess({
      systemId: updated.systemId,
      id: updated.id,
      name: updated.name,
      type: updated.type,
      description: updated.description,
      isDefault: updated.isDefault,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      ...(updated.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Pricing Policy API] PATCH error:', error);
    return apiError('Failed to update pricing policy', 500);
  }
}

// DELETE - Delete pricing policy
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ systemid: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemid } = await params;
    const existing = await prisma.settingsData.findFirst({
      where: { systemId: systemid, type: TYPE, isDeleted: false },
    });

    if (!existing) {
      return apiError('Pricing policy not found', 404);
    }

    // Soft delete
    await prisma.settingsData.update({
      where: { systemId: systemid },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: session.user.id,
      },
    });

    return apiSuccess({ message: 'Pricing policy deleted successfully' });
  } catch (error) {
    console.error('[Pricing Policy API] DELETE error:', error);
    return apiError('Failed to delete pricing policy', 500);
  }
}
