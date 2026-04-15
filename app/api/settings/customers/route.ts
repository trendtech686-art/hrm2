import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { createCustomerSettingSchema } from './validation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// Valid customer setting types
const VALID_TYPES = [
  'customer-group',
  'customer-type', 
  'customer-source',
  'payment-term',
  'credit-rating',
  'lifecycle-stage',
  'sla-setting',
];

// GET - List all customer settings (optionally filter by type)
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const where: { type?: string; isDeleted?: boolean } = { isDeleted: false };
    if (type && VALID_TYPES.includes(type)) {
      where.type = type;
    }

    const settings = await prisma.customerSetting.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { orderIndex: 'asc' },
        { name: 'asc' },
      ],
    });

    // Transform metadata back to flat structure
    const transformed = settings.map(s => ({
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
    }));

    return apiSuccess(transformed);
  } catch (error) {
    logError('[Customer Settings API] GET error', error);
    return apiError('Failed to fetch customer settings', 500);
  }
}

// POST - Create new customer setting
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, createCustomerSettingSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }
  const { 
    systemId, 
    id, 
    name, 
    type, 
    description, 
    color, 
    isDefault, 
    isActive,
    orderIndex,
    createdBy,
    ...extraFields 
  } = validation.data;

  try {
    const created = await prisma.customerSetting.create({
      data: {
        systemId: systemId || undefined, // Let Prisma generate if not provided
        id: id || await generateIdWithPrefix('CSETT', prisma),
        name,
        type,
        description,
        color,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
        orderIndex,
        metadata: Object.keys(extraFields).length > 0 ? (extraFields as Prisma.InputJsonValue) : undefined,
        createdBy,
        updatedBy: createdBy,
      },
    });

    createActivityLog({
      entityType: 'customer_settings',
      entityId: created.systemId,
      action: `Thêm cài đặt khách hàng: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({
      systemId: created.systemId,
      id: created.id,
      name: created.name,
      type: created.type,
      description: created.description,
      color: created.color,
      isDefault: created.isDefault,
      isActive: created.isActive,
      orderIndex: created.orderIndex,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      createdBy: created.createdBy,
      updatedBy: created.updatedBy,
      ...(created.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    logError('[Customer Settings API] POST error', error);
    
    // Handle unique constraint violation
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return apiError('A setting with this ID already exists for this type', 409);
    }

    return apiError('Failed to create customer setting', 500);
  }
}
