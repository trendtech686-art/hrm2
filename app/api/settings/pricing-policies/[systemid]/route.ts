import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { z } from 'zod';

const updatePricingPolicySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['Nhập hàng', 'Bán hàng']).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// GET - Get single pricing policy from PricingPolicy table
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ systemid: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemid } = await params;
    const policy = await prisma.pricingPolicy.findUnique({
      where: { systemId: systemid },
    });

    if (!policy) {
      return apiError('Pricing policy not found', 404);
    }

    return apiSuccess({
      systemId: policy.systemId,
      id: policy.id,
      name: policy.name,
      type: policy.type,
      description: policy.description,
      isDefault: policy.isDefault,
      isActive: policy.isActive,
      createdAt: policy.createdAt.toISOString(),
      updatedAt: policy.updatedAt.toISOString(),
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
    const existing = await prisma.pricingPolicy.findUnique({
      where: { systemId: systemid },
    });

    if (!existing) {
      return apiError('Pricing policy not found', 404);
    }

    const { id, name, description, type, isDefault, isActive } = validation.data;

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      const policyType = type ?? existing.type;
      await prisma.pricingPolicy.updateMany({
        where: {
          systemId: { not: systemid },
          type: policyType,
        },
        data: { isDefault: false },
      });
    }

    // Build update data
    const updateData: Prisma.PricingPolicyUpdateInput = {
      updatedBy: session.user.id,
    };

    if (id !== undefined) updateData.id = id;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await prisma.pricingPolicy.update({
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
    const existing = await prisma.pricingPolicy.findUnique({
      where: { systemId: systemid },
    });

    if (!existing) {
      return apiError('Pricing policy not found', 404);
    }

    // Hard delete (PricingPolicy doesn't have isDeleted field)
    await prisma.pricingPolicy.delete({
      where: { systemId: systemid },
    });

    return apiSuccess({ message: 'Pricing policy deleted successfully' });
  } catch (error) {
    console.error('[Pricing Policy API] DELETE error:', error);
    return apiError('Failed to delete pricing policy', 500);
  }
}
