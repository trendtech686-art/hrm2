/**
 * Import/Export Logs API
 * Stores audit trail of import/export operations
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import type { ImportLogEntry, ExportLogEntry } from '@/lib/import-export/types';
import { asSystemId } from '@/lib/id-types';

// GET /api/import-export-logs?entityType=customers&type=import&limit=100
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const entityType = request.nextUrl.searchParams.get('entityType');
    const type = request.nextUrl.searchParams.get('type') as 'import' | 'export' | null;
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '500', 10);

    const where: { entityType?: string; type?: string; userId: string } = {
      userId: session.user.id,
    };

    if (entityType) where.entityType = entityType;
    if (type) where.type = type;

    const logs = await prisma.importExportLog.findMany({
      where,
      orderBy: { performedAt: 'desc' },
      take: limit,
    });

    const importLogs: ImportLogEntry[] = [];
    const exportLogs: ExportLogEntry[] = [];

    logs.forEach((log) => {
      const baseLog = {
        id: log.id,
        entityType: log.entityType,
        performedAt: log.performedAt.toISOString(),
        performedBy: log.performedBy || session.user.name,
        status: log.status as 'success' | 'partial' | 'failed',
        totalRecords: log.totalRecords,
        successCount: log.successCount,
        errorCount: log.errorCount,
        errors: log.errors ? JSON.parse(log.errors as string) : undefined,
        filePath: log.filePath || undefined,
        fileName: log.fileName || undefined,
        notes: log.notes || undefined,
      };

      if (log.type === 'import') {
        importLogs.push({
          ...baseLog,
          entityDisplayName: log.entityType,
          fileName: log.fileName || '',
          fileSize: 0,
          totalRows: log.totalRecords,
          skippedCount: 0,
          insertedCount: log.successCount,
          updatedCount: 0,
          mode: 'upsert' as const,
          performedById: asSystemId(log.userId),
        } as ImportLogEntry);
      } else {
        exportLogs.push({
          ...baseLog,
          entityDisplayName: log.entityType,
          fileName: log.fileName || '',
          fileSize: 0,
          totalRows: log.totalRecords,
          scope: 'all' as const,
          columnsExported: [],
          performedById: asSystemId(log.userId),
        } as ExportLogEntry);
      }
    });

    return apiSuccess({ importLogs, exportLogs });
  } catch (error) {
    console.error('[API] Import/Export logs fetch error:', error);
    return apiError('Failed to fetch logs', 500);
  }
}

// POST /api/import-export-logs
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    const { type, ...logData } = body;

    if (!type || !['import', 'export'].includes(type)) {
      return apiError('Invalid type', 400);
    }

    const log = await prisma.importExportLog.create({
      data: {
        type,
        entityType: logData.entityType,
        performedAt: new Date(logData.performedAt || new Date()),
        performedBy: logData.performedBy || session.user.name,
        userId: session.user.id,
        status: logData.status,
        totalRecords: logData.totalRecords,
        successCount: logData.successCount,
        errorCount: logData.errorCount,
        errors: logData.errors ? JSON.stringify(logData.errors) : null,
        filePath: logData.filePath || null,
        fileName: logData.fileName || null,
        notes: logData.notes || null,
        duplicateHandling: logData.duplicateHandling || null,
        format: logData.format || null,
        filters: logData.filters ? JSON.stringify(logData.filters) : null,
      },
    });

    const response: ImportLogEntry | ExportLogEntry =
      type === 'import'
        ? {
            id: log.id,
            entityType: log.entityType,
            entityDisplayName: log.entityType,
            fileName: log.fileName || '',
            fileSize: 0,
            totalRows: log.totalRecords,
            successCount: log.successCount,
            errorCount: log.errorCount,
            skippedCount: 0,
            insertedCount: log.successCount,
            updatedCount: 0,
            mode: 'upsert' as const,
            performedBy: log.performedBy || session.user.name,
            performedById: asSystemId(log.userId),
            performedAt: log.performedAt.toISOString(),
            errors: log.errors ? JSON.parse(log.errors as string) : undefined,
            status: log.status as 'success' | 'partial' | 'failed',
          }
        : {
            id: log.id,
            entityType: log.entityType,
            entityDisplayName: log.entityType,
            fileName: log.fileName || '',
            fileSize: 0,
            totalRows: log.totalRecords,
            scope: 'all' as const,
            columnsExported: [],
            performedBy: log.performedBy || session.user.name,
            performedById: asSystemId(log.userId),
            performedAt: log.performedAt.toISOString(),
            status: log.status as 'success' | 'failed',
          };

    return apiSuccess(response);
  } catch (error) {
    console.error('[API] Import/Export log create error:', error);
    return apiError('Failed to create log', 500);
  }
}
