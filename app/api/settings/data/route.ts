import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiPaginated, apiSuccess, apiError } from '@/lib/api-utils';
import { parsePagination } from '@/lib/api-utils';
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants';
import { createSettingsDataSchema } from './validation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'

// GET - List all settings data (optionally filter by type). Any `type` is allowed for read (legacy / migration).
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const { page, limit, skip } = parsePagination(searchParams);
  const safeLimit = Math.min(limit, API_MAX_PAGE_LIMIT);

  try {
    const where: { type?: string; isDeleted?: boolean } = { isDeleted: false };
    if (type) {
      where.type = type;
    }

    const [settings, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: [
          { type: 'asc' },
          { name: 'asc' },
        ],
        skip,
        take: safeLimit,
      }),
      prisma.settingsData.count({ where }),
    ]);

    // Transform metadata back to flat structure
    const transformed = settings.map(s => ({
      systemId: s.systemId,
      id: s.id,
      name: s.name,
      type: s.type,
      description: s.description,
      isActive: s.isActive,
      isDefault: s.isDefault,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      createdBy: s.createdBy,
      updatedBy: s.updatedBy,
      ...(s.metadata as Record<string, unknown> || {}),
    }));

    return apiPaginated(transformed, { page, limit, total });
  } catch (error) {
    logError('[Settings Data API] GET error', error);
    return apiError('Failed to fetch settings data', 500);
  }
}

// POST - Create new settings data
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, createSettingsDataSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }
  const { 
    systemId, 
    id, 
    name, 
    type, 
    description,
    isActive,
    isDefault,
    createdBy,
    ...extraFields 
  } = validation.data;

  try {
    const created = await prisma.settingsData.create({
      data: {
        systemId: systemId || undefined,
        id: id || await generateIdWithPrefix(type.toUpperCase(), prisma),
        name,
        type,
        description,
        isActive: isActive ?? true,
        isDefault: isDefault ?? false,
        metadata: Object.keys(extraFields).length > 0 ? (extraFields as Prisma.InputJsonValue) : undefined,
        createdBy,
        updatedBy: createdBy,
      },
    });

    return apiSuccess({
      systemId: created.systemId,
      id: created.id,
      name: created.name,
      type: created.type,
      description: created.description,
      isActive: created.isActive,
      isDefault: created.isDefault,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      createdBy: created.createdBy,
      updatedBy: created.updatedBy,
      ...(created.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    logError('[Settings Data API] POST error', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return apiError('A setting with this ID already exists for this type', 409);
    }

    return apiError('Failed to create settings data', 500);
  }
}
