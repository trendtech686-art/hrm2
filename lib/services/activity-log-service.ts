/**
 * Activity Log Service
 * 
 * Centralized service for logging activity across all entities.
 * Replaces per-entity activityHistory JSON fields with a single ActivityLog table.
 */

import { prisma } from '@/lib/prisma';
import type { ActivityLogEntityType } from '@/lib/types/prisma-extended';

export interface ActivityLogEntry {
  entityType: ActivityLogEntityType;
  entityId: string;
  action: string;
  actionType?: 'create' | 'update' | 'delete' | 'status' | 'system';
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
  note?: string;
  createdBy?: string;
}

/**
 * Create a single activity log entry
 */
export async function createActivityLog(entry: ActivityLogEntry): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        actionType: entry.actionType,
        changes: entry.changes ? JSON.parse(JSON.stringify(entry.changes)) : undefined,
        metadata: entry.metadata ? JSON.parse(JSON.stringify(entry.metadata)) : undefined,
        note: entry.note,
        createdBy: entry.createdBy,
      },
    });
  } catch (error) {
    // Log error but don't fail the main operation
    console.error('[ActivityLog] Failed to create log entry:', error);
  }
}

/**
 * Create multiple activity log entries in a batch
 */
export async function createActivityLogs(entries: ActivityLogEntry[]): Promise<void> {
  if (entries.length === 0) return;
  
  try {
    await prisma.activityLog.createMany({
      data: entries.map(entry => ({
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        actionType: entry.actionType,
        changes: entry.changes ? JSON.parse(JSON.stringify(entry.changes)) : undefined,
        metadata: entry.metadata ? JSON.parse(JSON.stringify(entry.metadata)) : undefined,
        note: entry.note,
        createdBy: entry.createdBy,
      })),
    });
  } catch (error) {
    console.error('[ActivityLog] Failed to create log entries:', error);
  }
}

/**
 * Get activity logs for an entity
 */
export async function getActivityLogs(
  entityType: ActivityLogEntityType,
  entityId: string,
  options?: {
    limit?: number;
    offset?: number;
    actions?: string[];
  }
) {
  const { limit = 50, offset = 0, actions } = options || {};
  
  return prisma.activityLog.findMany({
    where: {
      entityType,
      entityId,
      ...(actions?.length ? { action: { in: actions } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

/**
 * Get recent activity logs across multiple entities
 */
export async function getRecentActivityLogs(options?: {
  entityTypes?: ActivityLogEntityType[];
  limit?: number;
  createdBy?: string;
}) {
  const { entityTypes, limit = 50, createdBy } = options || {};
  
  return prisma.activityLog.findMany({
    where: {
      ...(entityTypes?.length ? { entityType: { in: entityTypes } } : {}),
      ...(createdBy ? { createdBy } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Convert ActivityLog entries to HistoryEntry format for UI component
 */
export function convertToHistoryEntries(logs: Awaited<ReturnType<typeof getActivityLogs>>) {
  return logs.map(log => ({
    id: log.systemId,
    action: log.action,
    timestamp: log.createdAt,
    user: {
      systemId: log.createdBy || '',
      name: (log.metadata as Record<string, unknown>)?.userName as string || 'System',
    },
    changes: log.changes as Record<string, { from: unknown; to: unknown }> | undefined,
    description: log.note || undefined,
    metadata: log.metadata as Record<string, unknown> | undefined,
  }));
}

// Export service object for backward compatibility
export const activityLogService = {
  createActivityLog,
  createActivityLogs,
  getActivityLogs,
  getRecentActivityLogs,
  convertToHistoryEntries,
};
