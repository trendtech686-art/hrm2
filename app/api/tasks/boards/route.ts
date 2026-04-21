import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { logError } from '@/lib/logger';
import { createActivityLog } from '@/lib/services/activity-log-service';

// GET - List all boards
export async function GET() {
  const result = await requirePermission('view_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const boards = await prisma.taskBoard.findMany({
      where: { isDeleted: false },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return apiSuccess(boards);
  } catch (error) {
    logError('Failed to fetch task boards', error);
    return apiError('Không thể tải bảng công việc', 500);
  }
}

// POST - Create new board
export async function POST(request: NextRequest) {
  const result = await requirePermission('create_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const body = await request.json();

    const board = await prisma.$transaction(async (tx) => {
      const { systemId, businessId: id } = await generateNextIdsWithTx(tx, 'task-boards');

      return tx.taskBoard.create({
        data: {
          systemId,
          id,
          name: body.name,
          description: body.description || null,
          color: body.color || null,
          icon: body.icon || null,
          isActive: body.isActive ?? true,
          isDefault: body.isDefault ?? false,
          sortOrder: body.sortOrder ?? 0,
          createdBy: body.createdBy || null,
        },
      });
    });

    createActivityLog({
      entityType: 'task_board',
      entityId: board.systemId,
      action: `Tạo bảng công việc "${board.name}"`,
      actionType: 'create',
      metadata: { userName: body.createdBy },
      createdBy: body.createdBy || undefined,
    }).catch(() => undefined);

    return apiSuccess(board);
  } catch (error) {
    logError('Failed to create task board', error);
    return apiError('Không thể tạo bảng công việc', 500);
  }
}
