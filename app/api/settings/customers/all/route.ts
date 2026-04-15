import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';

// GET /api/settings/customers/all - Return all customer settings + pricing policies in a single response
export async function GET() {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const [allSettings, pricingPolicies] = await Promise.all([
      prisma.customerSetting.findMany({
        where: { isDeleted: false },
        orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
      }),
      prisma.pricingPolicy.findMany({
        orderBy: [{ name: 'asc' }],
      }),
    ]);

    const transform = (s: typeof allSettings[number]) => ({
      systemId: s.systemId,
      id: s.id,
      name: s.name,
      type: s.type,
      description: s.description,
      color: s.color,
      isDefault: s.isDefault,
      isActive: s.isActive,
      orderIndex: s.orderIndex,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      createdBy: s.createdBy,
      updatedBy: s.updatedBy,
      ...(s.metadata as Record<string, unknown> || {}),
    });

    const byType = (type: string) => allSettings.filter(s => s.type === type).map(transform);

    return apiSuccess({
      types: byType('customer-type'),
      groups: byType('customer-group'),
      sources: byType('customer-source'),
      paymentTerms: byType('payment-term'),
      creditRatings: byType('credit-rating'),
      lifecycleStages: byType('lifecycle-stage'),
      pricingPolicies: pricingPolicies.map(p => ({
        systemId: p.systemId,
        id: p.id,
        name: p.name,
        type: p.type,
        description: p.description,
        isDefault: p.isDefault,
        isActive: p.isActive,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        createdBy: p.createdBy,
        updatedBy: p.updatedBy,
      })),
    });
  } catch (error) {
    logError('[Customer Settings All] GET error', error);
    return apiError('Failed to fetch customer settings', 500);
  }
}
