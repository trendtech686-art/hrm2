/**
 * Activity Logs API Route
 * 
 * Centralized activity logging for all entities
 * POST - Create new activity log
 * GET - Fetch activity logs for an entity
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST - Create activity log
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    
    const {
      entityType,
      entityId,
      action,
      actionType,
      changes,
      metadata,
      note,
      createdBy,
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
        createdBy: createdBy || session?.user?.id || null,
      },
    });
    
    return NextResponse.json(activityLog, { status: 201 });
  } catch (error) {
    console.error('[Activity Logs API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create activity log' },
      { status: 500 }
    );
  }
}

// GET - Fetch activity logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const where: Record<string, unknown> = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count({ where }),
    ]);
    
    return NextResponse.json({
      data: logs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Activity Logs API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
