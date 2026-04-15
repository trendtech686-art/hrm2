/**
 * Import/Export Log Delete API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

// DELETE /api/import-export-logs/[id]?type=import
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { id } = await params;
    const type = request.nextUrl.searchParams.get('type');

    if (!type || !['import', 'export'].includes(type)) {
      return apiError('Invalid type parameter', 400);
    }

    // Verify ownership
    const log = await prisma.importExportLog.findUnique({
      where: { id },
      select: { userId: true, type: true },
    });

    if (!log) {
      return apiError('Log not found', 404);
    }

    if (log.userId !== session.user.id) {
      return apiError('Unauthorized', 403);
    }

    if (log.type !== type) {
      return apiError('Type mismatch', 400);
    }

    await prisma.importExportLog.delete({ where: { id } });

    return apiSuccess({ message: 'Log deleted' });
  } catch (error) {
    logError('[API] Import/Export log delete error', error);
    return apiError('Failed to delete log', 500);
  }
}
