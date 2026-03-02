/**
 * Import/Export Logs API - DB Direct
 * Fetches logs directly from database for the logs page
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, parsePagination } from '@/lib/api-utils';

// GET /api/import-export-logs/db?type=import&entityType=products&limit=500
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { limit } = parsePagination(request.nextUrl.searchParams);
    const type = request.nextUrl.searchParams.get('type');
    const entityType = request.nextUrl.searchParams.get('entityType');

    const where: { type?: string; entityType?: string } = {};

    if (type) where.type = type;
    if (entityType) where.entityType = entityType;

    const [logs, total] = await Promise.all([
      prisma.importExportLog.findMany({
        where,
        orderBy: { performedAt: 'desc' },
        take: limit,
      }),
      prisma.importExportLog.count({ where }),
    ]);

    return apiSuccess({ 
      data: logs.map(log => ({
        ...log,
        performedAt: log.performedAt.toISOString(),
      })),
      total,
    });
  } catch (error) {
    console.error('[API] Import/Export logs DB fetch error:', error);
    return apiError('Failed to fetch logs', 500);
  }
}
