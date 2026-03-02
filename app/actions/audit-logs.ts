'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { LogEntry, LogChange } from '@/lib/types/prisma-extended';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AuditLogResponse {
  data: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuditLogCreateInput {
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  action: string;
  changes: LogChange[];
}

/**
 * Fetch audit logs with filters
 */
export async function getAuditLogs(
  filters: AuditLogFilters = {}
): Promise<ActionResult<AuditLogResponse>> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) (where.createdAt as Record<string, unknown>).gte = new Date(filters.fromDate);
      if (filters.toDate) (where.createdAt as Record<string, unknown>).lte = new Date(filters.toDate);
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Map AuditLog to LogEntry format
    const mappedData: LogEntry[] = data.map((log) => ({
      systemId: log.systemId,
      id: log.systemId,
      timestamp: log.createdAt.toISOString(),
      entityType: log.entityType as LogEntry['entityType'],
      entityId: log.entityId,
      userId: log.userId || '',
      userName: log.userName || '',
      action: log.action as LogEntry['action'],
      changes: (log.changes as LogChange[]) || [],
    }));

    return {
      success: true,
      data: {
        data: mappedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return { success: false, error: 'Không thể tải lịch sử hoạt động' };
  }
}

/**
 * Fetch audit logs for a specific entity
 */
export async function getEntityAuditLogs(
  entityId: string,
  entityType?: string
): Promise<ActionResult<LogEntry[]>> {
  try {
    const where: Record<string, unknown> = { entityId };
    if (entityType) where.entityType = entityType;

    const data = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Map AuditLog to LogEntry format
    const mappedData: LogEntry[] = data.map((log) => ({
      systemId: log.systemId,
      id: log.systemId,
      timestamp: log.createdAt.toISOString(),
      entityType: log.entityType as LogEntry['entityType'],
      entityId: log.entityId,
      userId: log.userId || '',
      userName: log.userName || '',
      action: log.action as LogEntry['action'],
      changes: (log.changes as LogChange[]) || [],
    }));

    return { success: true, data: mappedData };
  } catch (error) {
    console.error('Failed to fetch entity audit logs:', error);
    return { success: false, error: 'Không thể tải lịch sử hoạt động' };
  }
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  data: AuditLogCreateInput
): Promise<ActionResult<LogEntry>> {
  try {
    const entry = await prisma.auditLog.create({
      data: {
        systemId: await generateIdWithPrefix('AUDIT', prisma),
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        userName: data.userName,
        action: data.action,
        changes: data.changes as unknown as Prisma.InputJsonValue,
      },
    });

    // Map to LogEntry format
    const mappedEntry: LogEntry = {
      systemId: entry.systemId,
      id: entry.systemId,
      timestamp: entry.createdAt.toISOString(),
      entityType: entry.entityType as LogEntry['entityType'],
      entityId: entry.entityId,
      userId: entry.userId || '',
      userName: entry.userName || '',
      action: entry.action as LogEntry['action'],
      changes: (entry.changes as LogChange[]) || [],
    };

    return { success: true, data: mappedEntry };
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return { success: false, error: 'Không thể tạo log' };
  }
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats(
  period?: { fromDate: string; toDate: string }
): Promise<ActionResult<{ total: number; byAction: Record<string, number>; byEntityType: Record<string, number> }>> {
  try {
    const where: Record<string, unknown> = {};
    if (period) {
      where.createdAt = {
        gte: new Date(period.fromDate),
        lte: new Date(period.toDate),
      };
    }

    const [total, byAction, byEntityType] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ['entityType'],
        where,
        _count: true,
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        byAction: Object.fromEntries(byAction.map((r) => [r.action, r._count])),
        byEntityType: Object.fromEntries(byEntityType.map((r) => [r.entityType, r._count])),
      },
    };
  } catch (error) {
    console.error('Failed to get audit log stats:', error);
    return { success: false, error: 'Không thể tải thống kê' };
  }
}
