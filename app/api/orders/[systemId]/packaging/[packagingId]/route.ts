import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// GET /api/orders/[systemId]/packaging/[packagingId] - Get packaging details
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { packagingId } = await params;

    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: {
        order: true,
        assignedEmployee: true,
        shipment: true,
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    // Log activity
    const userName = await getUserNameFromDb(session.user?.id);
    await prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: packagingId,
        action: 'updated',
        actionType: 'update',
        note: `Cập nhật phiếu đóng gói`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] packaging updated failed', e))

    return apiSuccess(packaging);
  } catch (error) {
    logError('Error fetching packaging', error);
    return apiError('Failed to fetch packaging', 500);
  }
}

// PATCH /api/orders/[systemId]/packaging/[packagingId] - Update packaging
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { packagingId } = await params;
    const body = await request.json();

    const packaging = await prisma.packaging.update({
      where: { systemId: packagingId },
      data: body,
      include: {
        order: true,
        assignedEmployee: true,
        shipment: true,
      },
    });

    return apiSuccess(packaging);
  } catch (error) {
    logError('Error updating packaging', error);
    return apiError('Failed to update packaging', 500);
  }
}
