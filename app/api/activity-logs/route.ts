/**
 * Activity Logs API Route
 * 
 * Centralized activity logging for all entities
 * POST - Create new activity log
 * GET - Fetch activity logs for an entity
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookie, serializeDecimals } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants';

// POST - Create activity log
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookie();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      entityType,
      entityId,
      action,
      actionType,
      changes,
      metadata,
      note,
    } = body;
    
    // Validate required fields
    if (!entityType || !entityId || !action) {
      return NextResponse.json(
        { error: 'entityType, entityId, and action are required' },
        { status: 400 }
      );
    }
    
    const activityLog = await prisma.activityLog.create({
      data: {
        entityType,
        entityId,
        action,
        actionType: actionType || 'update',
        changes: changes || null,
        metadata: metadata || null,
        note: note || null,
        createdBy: body.createdBy || session.user?.employee?.fullName || session.user?.name || session.user?.email || 'Hệ thống',
      },
    });
    
    return NextResponse.json(activityLog, { status: 201 });
  } catch (error) {
    logError('[Activity Logs API] POST error', error);
    return NextResponse.json(
      { error: 'Failed to create activity log' },
      { status: 500 }
    );
  }
}

// GET - Fetch activity logs
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromCookie();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    // Pagination
    const page = Math.max(parseInt(searchParams.get('page') || '1') || 1, 1);
    const rawLimit = parseInt(searchParams.get('limit') || '50') || 50;
    const limit = Math.min(Math.max(rawLimit, 1), API_MAX_PAGE_LIMIT);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (entityType) {
      where.entityType = entityType.includes(',')
        ? { in: entityType.split(',') }
        : entityType;
    }
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (userId) where.createdBy = userId;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) (where.createdAt as Record<string, unknown>).gte = new Date(fromDate);
      if (toDate) (where.createdAt as Record<string, unknown>).lte = new Date(toDate + 'T23:59:59');
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.activityLog.count({ where }),
    ]);

    // Resolve createdBy systemIds to display names for logs missing metadata.userName
    const unresolvedIds = new Set<string>();
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    for (const log of logs) {
      const meta = log.metadata as Record<string, unknown> | null;
      if (!meta?.userName && log.createdBy && uuidPattern.test(log.createdBy)) {
        unresolvedIds.add(log.createdBy);
      }
    }
    const nameMap = new Map<string, string>();
    if (unresolvedIds.size > 0) {
      const users = await prisma.user.findMany({
        where: { systemId: { in: [...unresolvedIds] } },
        select: { systemId: true, email: true, employee: { select: { fullName: true } } },
      });
      for (const u of users) {
        nameMap.set(u.systemId, u.employee?.fullName || u.email);
      }
    }
    const enrichedLogs = logs.map(log => {
      const meta = log.metadata as Record<string, unknown> | null;
      if (meta?.userName) return log;
      if (log.createdBy && nameMap.has(log.createdBy)) {
        return {
          ...log,
          metadata: { ...meta, userName: nameMap.get(log.createdBy) },
        };
      }
      return log;
    });

    return NextResponse.json({
      data: serializeDecimals(enrichedLogs),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logError('[Activity Logs API] GET error', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
