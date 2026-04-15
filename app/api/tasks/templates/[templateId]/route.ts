import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';

// GET - Single template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const result = await requirePermission('view_tasks');
  if (result instanceof NextResponse) return result;

  const { templateId } = await params;

  try {
    const template = await prisma.taskTemplate.findUnique({
      where: { systemId: templateId },
    });

    if (!template || template.isDeleted) {
      return apiError('Không tìm thấy mẫu công việc', 404);
    }

    return apiSuccess(template);
  } catch (error) {
    logError('Failed to fetch task template', error);
    return apiError('Không thể tải mẫu công việc', 500);
  }
}

// PUT - Update template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const result = await requirePermission('edit_tasks');
  if (result instanceof NextResponse) return result;

  const { templateId } = await params;

  try {
    const body = await request.json();

    const existing = await prisma.taskTemplate.findUnique({
      where: { systemId: templateId },
    });

    if (!existing || existing.isDeleted) {
      return apiError('Không tìm thấy mẫu công việc', 404);
    }

    const template = await prisma.taskTemplate.update({
      where: { systemId: templateId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.taskDescription !== undefined && { taskDescription: body.taskDescription }),
        ...(body.priority !== undefined && { priority: mapPriority(body.priority) }),
        ...(body.estimatedHours !== undefined && { estimatedHours: body.estimatedHours }),
        ...(body.assigneeRoles !== undefined && { assigneeRoles: body.assigneeRoles }),
        ...(body.subtasks !== undefined && { subtasks: body.subtasks }),
        ...(body.checklistItems !== undefined && { checklistItems: body.checklistItems }),
        ...(body.customFields !== undefined && { customFields: body.customFields }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.usageCount !== undefined && { usageCount: body.usageCount }),
      },
    });

    return apiSuccess(template);
  } catch (error) {
    logError('Failed to update task template', error);
    return apiError('Không thể cập nhật mẫu công việc', 500);
  }
}

// DELETE - Soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const result = await requirePermission('delete_tasks');
  if (result instanceof NextResponse) return result;

  const { templateId } = await params;

  try {
    await prisma.taskTemplate.update({
      where: { systemId: templateId },
      data: { isDeleted: true },
    });

    return apiSuccess({ message: 'Đã xóa' });
  } catch (error) {
    logError('Failed to delete task template', error);
    return apiError('Không thể xóa mẫu công việc', 500);
  }
}

function mapPriority(priority: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  const map: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
    'Thấp': 'LOW', 'low': 'LOW', 'LOW': 'LOW',
    'Trung bình': 'MEDIUM', 'medium': 'MEDIUM', 'MEDIUM': 'MEDIUM',
    'Cao': 'HIGH', 'high': 'HIGH', 'HIGH': 'HIGH',
    'Khẩn cấp': 'URGENT', 'urgent': 'URGENT', 'URGENT': 'URGENT',
  };
  return map[priority] || 'MEDIUM';
}
