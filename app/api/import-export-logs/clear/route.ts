/**
 * Import/Export Logs Clear API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

// DELETE /api/import-export-logs/clear?entityType=customers
export async function DELETE(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const entityType = request.nextUrl.searchParams.get('entityType');

    const where: { userId: string; entityType?: string } = {
      userId: session.user.id,
    };

    if (entityType) {
      where.entityType = entityType;
    }

    const result = await prisma.importExportLog.deleteMany({ where });

    return apiSuccess({ 
      message: `Deleted ${result.count} log${result.count !== 1 ? 's' : ''}`,
      count: result.count 
    });
  } catch (error) {
    console.error('[API] Import/Export logs clear error:', error);
    return apiError('Failed to clear logs', 500);
  }
}
