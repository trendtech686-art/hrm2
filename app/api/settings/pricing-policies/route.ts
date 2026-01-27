import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError, apiPaginated } from '@/lib/api-utils';
import { z } from 'zod';

const TYPE = 'pricing-policy';

const createPricingPolicySchema = z.object({
  id: z.string().min(1, 'Mã bảng giá là bắt buộc'),
  name: z.string().min(1, 'Tên bảng giá là bắt buộc'),
  description: z.string().optional(),
  type: z.enum(['Nhập hàng', 'Bán hàng']),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// GET - List all pricing policies
export async function GET(request: NextRequest) {
  try {
    console.log('[Pricing Policies GET] Starting...');
    const session = await requireAuth();
    console.log('[Pricing Policies GET] Session:', session ? 'authenticated' : 'not authenticated');
    if (!session) return apiError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '50');
    const type = searchParams.get('type');
    const isActiveParam = searchParams.get('isActive');

    console.log('[Pricing Policies GET] Query params:', { page, limit, type, isActiveParam });

    const skip = (page - 1) * limit;

    const where: Prisma.SettingsDataWhereInput = {
      type: TYPE,
      isDeleted: false,
    };

    // Filter by type in metadata
    if (type) {
      where.metadata = {
        path: ['type'],
        equals: type,
      };
    }

    // Filter by isActive
    if (isActiveParam !== null) {
      where.isActive = isActiveParam === 'true';
    }

    const [settings, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.settingsData.count({ where }),
    ]);

    console.log('[Pricing Policies GET] Found:', { total, settingsCount: settings.length });

    const transformed = settings.map(s => ({
      systemId: s.systemId,
      id: s.id,
      name: s.name,
      type: s.type,
      description: s.description,
      isDefault: s.isDefault,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      createdBy: s.createdBy,
      updatedBy: s.updatedBy,
      ...(s.metadata as Record<string, unknown> || {}),
    }));

    return apiPaginated(transformed, { page, limit, total });
  } catch (error) {
    console.error('[Pricing Policies API] GET error:', error);
    console.error('[Pricing Policies API] GET error stack:', error instanceof Error ? error.stack : 'No stack');
    return apiError('Failed to fetch pricing policies', 500);
  }
}

// POST - Create a new pricing policy
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, createPricingPolicySchema);
  if (!validation.success) {
    console.error('[Pricing Policies POST] Validation failed:', validation.error);
    return apiError(validation.error, 400);
  }

  console.log('[Pricing Policies POST] Creating with data:', validation.data);

  try {
    const { id, name, description, type, isDefault, isActive } = validation.data;

    // Check if ID already exists
    const existing = await prisma.settingsData.findFirst({
      where: { id, type: TYPE, isDeleted: false },
    });

    if (existing) {
      return apiError(`Mã bảng giá "${id}" đã tồn tại`, 400);
    }

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      await prisma.settingsData.updateMany({
        where: {
          type: TYPE,
          isDeleted: false,
          metadata: {
            path: ['type'],
            equals: type,
          },
        },
        data: { isDefault: false },
      });
    }

    const setting = await prisma.settingsData.create({
      data: {
        id,
        name,
        type: TYPE,
        description,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
        metadata: { type } as Prisma.InputJsonValue,
        createdBy: session.user.id,
      },
    });

    console.log('[Pricing Policies POST] Created:', setting.systemId);

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
    }, 201);
  } catch (error) {
    console.error('[Pricing Policies API] POST error:', error);
    return apiError('Failed to create pricing policy', 500);
  }
}
