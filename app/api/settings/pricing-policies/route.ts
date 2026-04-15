import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError, apiPaginated, parsePagination } from '@/lib/api-utils';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const createPricingPolicySchema = z.object({
  id: z.string().min(1, 'Mã bảng giá là bắt buộc'),
  name: z.string().min(1, 'Tên bảng giá là bắt buộc'),
  description: z.string().optional(),
  type: z.enum(['Nhập hàng', 'Bán hàng']),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// GET - List all pricing policies from PricingPolicy table
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) return apiError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const type = searchParams.get('type');
    const isActiveParam = searchParams.get('isActive');

    const where: Prisma.PricingPolicyWhereInput = {};

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Filter by isActive - only filter if param is explicitly provided
    if (isActiveParam !== null && isActiveParam !== undefined) {
      where.isActive = isActiveParam === 'true';
    }

    const [policies, total] = await Promise.all([
      prisma.pricingPolicy.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.pricingPolicy.count({ where }),
    ]);

    const transformed = policies.map(p => ({
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
    }));

    return apiPaginated(transformed, { page, limit, total });
  } catch (error) {
    logError('[Pricing Policies API] GET error', error);
    return apiError('Failed to fetch pricing policies', 500);
  }
}

// POST - Create a new pricing policy
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, createPricingPolicySchema);
  if (!validation.success) {
    logError('[Pricing Policies POST] Validation failed', validation.error);
    return apiError(validation.error, 400);
  }

  try {
    const { id, name, description, type, isDefault, isActive } = validation.data;

    // Check if ID already exists
    const existing = await prisma.pricingPolicy.findUnique({
      where: { id },
    });

    if (existing) {
      return apiError(`Mã bảng giá "${id}" đã tồn tại`, 400);
    }

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      await prisma.pricingPolicy.updateMany({
        where: { type },
        data: { isDefault: false },
      });
    }

    const policy = await prisma.pricingPolicy.create({
      data: {
        systemId: `PP${nanoid(10)}`,
        id,
        name,
        type,
        description,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
        createdBy: session.user.id,
      },
    });

    createActivityLog({
      entityType: 'pricing_policy',
      entityId: policy.systemId,
      action: `Thêm bảng giá: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('activity log failed', e))

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
    }, 201);
  } catch (error) {
    logError('[Pricing Policies API] POST error', error);
    return apiError('Failed to create pricing policy', 500);
  }
}
