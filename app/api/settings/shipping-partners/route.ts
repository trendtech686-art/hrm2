import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/settings/shipping-partners - List all shipping partners
export async function GET(_request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const partners = await prisma.shippingPartner.findMany({
      orderBy: { name: 'asc' },
    });

    return apiSuccess(partners);
  } catch (error) {
    logError('Error fetching shipping partners', error);
    return apiError('Failed to fetch shipping partners', 500);
  }
}

// POST /api/settings/shipping-partners - Create shipping partner
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    const { id, name, code, description, logo, website, isActive, services, configuration } = body;

    if (!name || !code) {
      return apiError('Name and code are required', 400);
    }

    // Check for duplicate code
    const existing = await prisma.shippingPartner.findUnique({
      where: { code },
    });
    if (existing) {
      return apiError(`Shipping partner with code ${code} already exists`, 400);
    }

    const partner = await prisma.shippingPartner.create({
      data: {
        id: id || code,
        name,
        code,
        description,
        logo,
        website,
        isActive: isActive ?? true,
        services,
        configuration,
        createdBy: session.user?.name || 'System',
      },
    });

    createActivityLog({
      entityType: 'shipping_partner',
      entityId: partner.id,
      action: `Tạo đối tác vận chuyển: ${name}`,
      actionType: 'create',
      changes: {
        'Tên': { from: null, to: name },
        'Mã': { from: null, to: code },
      },
      createdBy: session.user?.id ?? '',
    }).catch(e => logError('[shipping-partners] activity log failed', e));

    return apiSuccess(partner, 201);
  } catch (error) {
    logError('Error creating shipping partner', error);
    return apiError('Failed to create shipping partner', 500);
  }
}
