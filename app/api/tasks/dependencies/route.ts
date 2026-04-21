import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';
import { createActivityLog } from '@/lib/services/activity-log-service';

// POST - Add or remove task dependency
// Body: { taskId: string, dependsOn: string, action: 'add' | 'remove' }
export async function POST(request: NextRequest) {
  const result = await requirePermission('edit_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const { taskId, dependsOn, action } = await request.json();

    if (!taskId || !dependsOn || !['add', 'remove'].includes(action)) {
      return apiError('Thiếu thông tin: taskId, dependsOn, action (add/remove)', 400);
    }

    if (taskId === dependsOn) {
      return apiError('Không thể tạo dependency với chính nó', 400);
    }

    // Verify both tasks exist
    const [task, depTask] = await Promise.all([
      prisma.task.findUnique({ where: { systemId: taskId }, select: { systemId: true, blockedBy: true, blocks: true } }),
      prisma.task.findUnique({ where: { systemId: dependsOn }, select: { systemId: true, blockedBy: true, blocks: true } }),
    ]);

    if (!task || !depTask) {
      return apiError('Không tìm thấy công việc', 404);
    }

    if (action === 'add') {
      // Check for circular dependency
      if (await hasCircularDependency(dependsOn, taskId)) {
        return apiError('Phát hiện dependency vòng tròn', 400);
      }

      // taskId is blocked by dependsOn
      const newBlockedBy = [...new Set([...task.blockedBy, dependsOn])];
      // dependsOn blocks taskId
      const newBlocks = [...new Set([...depTask.blocks, taskId])];

      await prisma.$transaction([
        prisma.task.update({
          where: { systemId: taskId },
          data: { blockedBy: newBlockedBy },
        }),
        prisma.task.update({
          where: { systemId: dependsOn },
          data: { blocks: newBlocks },
        }),
      ]);
    } else {
      // Remove dependency
      const newBlockedBy = task.blockedBy.filter(id => id !== dependsOn);
      const newBlocks = depTask.blocks.filter(id => id !== taskId);

      await prisma.$transaction([
        prisma.task.update({
          where: { systemId: taskId },
          data: { blockedBy: newBlockedBy },
        }),
        prisma.task.update({
          where: { systemId: dependsOn },
          data: { blocks: newBlocks },
        }),
      ]);
    }

    // Return updated task
    const updated = await prisma.task.findUnique({
      where: { systemId: taskId },
    });

    createActivityLog({
      entityType: 'task',
      entityId: taskId,
      action: action === 'add'
        ? `Thêm dependency: bị chặn bởi ${dependsOn}`
        : `Gỡ dependency: bị chặn bởi ${dependsOn}`,
      actionType: 'update',
      metadata: { dependsOn, action },
    }).catch(() => undefined);

    return apiSuccess(updated);
  } catch (error) {
    logError('Failed to update task dependencies', error);
    return apiError('Không thể cập nhật dependencies', 500);
  }
}

/**
 * Check if adding a dependency from depId -> taskId creates a cycle
 * i.e., if taskId already (directly or transitively) blocks depId
 */
async function hasCircularDependency(depId: string, taskId: string): Promise<boolean> {
  const visited = new Set<string>();
  const queue = [taskId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === depId) return true;
    if (visited.has(current)) continue;
    visited.add(current);

    const task = await prisma.task.findUnique({
      where: { systemId: current },
      select: { blocks: true },
    });

    if (task?.blocks) {
      queue.push(...task.blocks.filter(id => !visited.has(id)));
    }
  }

  return false;
}
