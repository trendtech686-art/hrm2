/**
 * Inventory Check Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single inventory check
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryCheck) {
      return apiNotFound('Inventory check');
    }

    return apiSuccess(inventoryCheck);
  } catch (error) {
    console.error('[Inventory Checks API] GET by ID error:', error);
    return apiError('Failed to fetch inventory check', 500);
  }
}

// PATCH - Update inventory check
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const {
      status,
      notes,
      updatedBy,
    } = body;

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(inventoryCheck);
  } catch (error) {
    console.error('[Inventory Checks API] PATCH error:', error);
    return apiError('Failed to update inventory check', 500);
  }
}

// DELETE - Soft or hard delete inventory check
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    if (hard) {
      await prisma.inventoryCheckItem.deleteMany({
        where: { checkId: systemId },
      });
      
      await prisma.inventoryCheck.delete({
        where: { systemId },
      });
    } else {
      // InventoryCheck has no soft delete fields, use hard delete
      await prisma.inventoryCheckItem.deleteMany({
        where: { checkId: systemId },
      });
      
      await prisma.inventoryCheck.delete({
        where: { systemId },
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Inventory Checks API] DELETE error:', error);
    return apiError('Failed to delete inventory check', 500);
  }
}
