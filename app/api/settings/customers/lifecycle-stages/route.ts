import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { createLifecycleStageSchema } from './validation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'lifecycle-stage';

// GET - List all lifecycle stages
export async function GET() {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const settings = await prisma.customerSetting.findMany({
      where: { type: TYPE, isDeleted: false },
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
    });

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
    logError('[Lifecycle Stages API] GET error', error);
    return apiError('Failed to fetch lifecycle stages', 500);
  }
}

// POST - Create a new lifecycle stage
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, createLifecycleStageSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  try {
    const { name, description, color, isDefault, isActive, orderIndex, ...rest } = validation.data;

    const setting = await prisma.customerSetting.create({
      data: {
        id: await generateIdWithPrefix('LCSTG', prisma),
        name,
        type: TYPE,
        description,
        color,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
        orderIndex: orderIndex ?? 0,
        metadata: rest as Prisma.InputJsonValue,
      },
    });

    createActivityLog({
      entityType: 'customer_lifecycle_stage',
      entityId: setting.systemId,
      action: `Thêm giai đoạn vòng đời: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      color: setting.color,
      isDefault: setting.isDefault,
      isActive: setting.isActive,
      orderIndex: setting.orderIndex,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      ...(setting.metadata as Record<string, unknown> || {}),
    }, 201);
  } catch (error) {
    logError('[Lifecycle Stages API] POST error', error);
    return apiError('Failed to create lifecycle stage', 500);
  }
}
