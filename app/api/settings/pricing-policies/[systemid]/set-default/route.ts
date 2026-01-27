import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

const TYPE = 'pricing-policy';

// POST - Set as default pricing policy
export async function POST(
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

    const policyType = (setting.metadata as any)?.type;

    // Unset all other defaults of same type
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

    // Set this as default
    const updated = await prisma.settingsData.update({
      where: { systemId: systemid },
      data: {
        isDefault: true,
        updatedBy: session.user.id,
      },
    });

    return apiSuccess({
      systemId: updated.systemId,
      id: updated.id,
      name: updated.name,
      isDefault: updated.isDefault,
    });
  } catch (error) {
    console.error('[Pricing Policy API] Set default error:', error);
    return apiError('Failed to set default pricing policy', 500);
  }
}
