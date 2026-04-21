import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { logError } from '@/lib/logger';
import { createActivityLog } from '@/lib/services/activity-log-service';

// GET - List all templates
export async function GET() {
  const result = await requirePermission('view_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const templates = await prisma.taskTemplate.findMany({
      where: { isDeleted: false },
      orderBy: [{ usageCount: 'desc' }, { createdAt: 'desc' }],
    });

    return apiSuccess(templates);
  } catch (error) {
    logError('Failed to fetch task templates', error);
    return apiError('Không thể tải mẫu công việc', 500);
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  const result = await requirePermission('create_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const body = await request.json();

    const template = await prisma.$transaction(async (tx) => {
      const { systemId, businessId: id } = await generateNextIdsWithTx(tx, 'task-templates');

      return tx.taskTemplate.create({
        data: {
          systemId,
          id,
          name: body.name,
          description: body.description || null,
          category: body.category || null,
          title: body.title || null,
          taskDescription: body.taskDescription || null,
          priority: mapPriority(body.priority),
          estimatedHours: body.estimatedHours || null,
          type: body.type || null,
          assigneeRoles: body.assigneeRoles || null,
          subtasks: body.subtasks || null,
          checklistItems: body.checklistItems || null,
          customFields: body.customFields || null,
          isActive: body.isActive ?? true,
          createdBy: body.createdBy || null,
        },
      });
    });

    createActivityLog({
      entityType: 'task_template',
      entityId: template.systemId,
      action: `Tạo mẫu công việc "${template.name}"`,
      actionType: 'create',
      metadata: { userName: body.createdBy },
      createdBy: body.createdBy || undefined,
    }).catch(() => undefined);

    return apiSuccess(template);
  } catch (error) {
    logError('Failed to create task template', error);
    return apiError('Không thể tạo mẫu công việc', 500);
  }
}

function mapPriority(priority: string | undefined): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  if (!priority) return 'MEDIUM';
  const map: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
    'Thấp': 'LOW', 'low': 'LOW', 'LOW': 'LOW',
    'Trung bình': 'MEDIUM', 'medium': 'MEDIUM', 'MEDIUM': 'MEDIUM',
    'Cao': 'HIGH', 'high': 'HIGH', 'HIGH': 'HIGH',
    'Khẩn cấp': 'URGENT', 'urgent': 'URGENT', 'URGENT': 'URGENT',
  };
  return map[priority] || 'MEDIUM';
}
