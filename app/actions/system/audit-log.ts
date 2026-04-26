'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { logError } from '@/lib/logger'
import { requireActionPermission } from '@/lib/api-utils'

type ActivityLog = NonNullable<Awaited<ReturnType<typeof prisma.activityLog.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ActivityLogFilters {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: string;
  action?: string;
  actionType?: string;
  createdBy?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedActivityLogs {
  data: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get activity logs with filters
 */
export async function getActivityLogs(
  filters: ActivityLogFilters = {}
): Promise<ActionResult<PaginatedActivityLogs>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const {
      page = 1,
      limit = 50,
      entityType,
      entityId,
      action,
      actionType,
      createdBy,
      startDate,
      endDate,
    } = filters;

    const where: Record<string, unknown> = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (actionType) where.actionType = actionType;
    if (createdBy) where.createdBy = createdBy;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate;
      if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate;
    }

    const [data, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    logError('Failed to fetch activity logs', error);
    return { success: false, error: 'Không thể tải lịch sử hoạt động' };
  }
}

/**
 * Get activity logs for a specific entity
 */
export async function getEntityActivityLogs(
  entityType: string,
  entityId: string,
  limit: number = 50
): Promise<ActionResult<ActivityLog[]>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const logs = await prisma.activityLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return { success: true, data: logs };
  } catch (error) {
    logError('Failed to fetch entity activity logs', error);
    return { success: false, error: 'Không thể tải lịch sử hoạt động' };
  }
}

/**
 * Get activity logs by user
 */
export async function getUserActivityLogs(
  userId: string,
  options: { limit?: number; entityType?: string } = {}
): Promise<ActionResult<ActivityLog[]>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const where: Record<string, unknown> = { createdBy: userId };
    if (options.entityType) where.entityType = options.entityType;

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options.limit || 50,
    });

    return { success: true, data: logs };
  } catch (error) {
    logError('Failed to fetch user activity logs', error);
    return { success: false, error: 'Không thể tải lịch sử hoạt động' };
  }
}

/**
 * Create an activity log entry
 */
export async function createActivityLog(data: {
  entityType: string;
  entityId: string;
  action: string;
  actionType?: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
  note?: string;
  createdBy?: string;
}): Promise<ActionResult<ActivityLog>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const log = await prisma.activityLog.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        actionType: data.actionType,
        changes: data.changes as Prisma.InputJsonValue,
        metadata: data.metadata as Prisma.InputJsonValue,
        note: data.note,
        createdBy: authResult.session.user?.id || null,
      },
    });

    return { success: true, data: log };
  } catch (error) {
    logError('Failed to create activity log', error);
    return { success: false, error: 'Không thể ghi log hoạt động' };
  }
}

/**
 * Get available entity types
 */
export async function getActivityLogEntityTypes(): Promise<ActionResult<string[]>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const types = await prisma.activityLog.findMany({
      select: { entityType: true },
      distinct: ['entityType'],
      orderBy: { entityType: 'asc' },
    });

    return { success: true, data: types.map((t) => t.entityType) };
  } catch (error) {
    logError('Failed to fetch entity types', error);
    return { success: false, error: 'Không thể tải danh sách loại entity' };
  }
}

/**
 * Get available actions
 */
export async function getActivityLogActions(
  entityType?: string
): Promise<ActionResult<string[]>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const where: Record<string, unknown> = {};
    if (entityType) where.entityType = entityType;

    const actions = await prisma.activityLog.findMany({
      where,
      select: { action: true },
      distinct: ['action'],
      orderBy: { action: 'asc' },
    });

    return { success: true, data: actions.map((a) => a.action) };
  } catch (error) {
    logError('Failed to fetch actions', error);
    return { success: false, error: 'Không thể tải danh sách hành động' };
  }
}

/**
 * Get activity summary for dashboard
 */
export async function getActivitySummary(
  options: { startDate?: Date; endDate?: Date; entityType?: string } = {}
): Promise<ActionResult<{
  totalActivities: number;
  byActionType: Record<string, number>;
  byEntityType: Record<string, number>;
  recentUsers: { userId: string; count: number }[];
}>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const where: Record<string, unknown> = {};
    if (options.entityType) where.entityType = options.entityType;
    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) (where.createdAt as Record<string, unknown>).gte = options.startDate;
      if (options.endDate) (where.createdAt as Record<string, unknown>).lte = options.endDate;
    }

    const [total, byActionType, byEntityType, recentUsers] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.groupBy({
        by: ['actionType'],
        where: { ...where, actionType: { not: null } },
        _count: true,
      }),
      prisma.activityLog.groupBy({
        by: ['entityType'],
        where,
        _count: true,
      }),
      prisma.activityLog.groupBy({
        by: ['createdBy'],
        where: { ...where, createdBy: { not: null } },
        _count: true,
        orderBy: { _count: { createdBy: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      success: true,
      data: {
        totalActivities: total,
        byActionType: byActionType.reduce(
          (acc, item) => {
            if (item.actionType) acc[item.actionType] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        byEntityType: byEntityType.reduce(
          (acc, item) => {
            acc[item.entityType] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        recentUsers: recentUsers
          .filter((u) => u.createdBy)
          .map((u) => ({ userId: u.createdBy!, count: u._count })),
      },
    };
  } catch (error) {
    logError('Failed to get activity summary', error);
    return { success: false, error: 'Không thể tải tổng hợp hoạt động' };
  }
}

/**
 * Delete old activity logs
 */
export async function deleteOldActivityLogs(
  olderThan: Date
): Promise<ActionResult<{ count: number }>> {
  const authResult = await requireActionPermission('edit_settings')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const result = await prisma.activityLog.deleteMany({
      where: { createdAt: { lt: olderThan } },
    });

    return { success: true, data: { count: result.count } };
  } catch (error) {
    logError('Failed to delete old activity logs', error);
    return { success: false, error: 'Không thể xóa log cũ' };
  }
}

/**
 * Get recent activities for timeline
 */
export async function getRecentActivities(
  limit: number = 20,
  entityTypes?: string[]
): Promise<ActionResult<ActivityLog[]>> {
  const authResult = await requireActionPermission('view_audit_log')
  if (!authResult.success) return { success: false, error: authResult.error }

  try {
    const where: Record<string, unknown> = {};
    if (entityTypes && entityTypes.length > 0) {
      where.entityType = { in: entityTypes };
    }

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return { success: true, data: logs };
  } catch (error) {
    logError('Failed to fetch recent activities', error);
    return { success: false, error: 'Không thể tải hoạt động gần đây' };
  }
}
