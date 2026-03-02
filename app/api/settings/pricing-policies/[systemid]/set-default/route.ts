import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

// POST - Set as default pricing policy
export async function POST(
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

    const policyType = policy.type;

    // Unset all other defaults of same type
    await prisma.pricingPolicy.updateMany({
      where: {
        systemId: { not: systemid },
        type: policyType,
      },
      data: { isDefault: false },
    });

    // Set this as default
    const updated = await prisma.pricingPolicy.update({
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
