import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger';

// POST - Increment usage count when a template is used to create a task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const result = await requirePermission('view_tasks');
  if (result instanceof NextResponse) return result;

  const { templateId } = await params;

  try {
    const template = await prisma.taskTemplate.update({
      where: { systemId: templateId },
      data: { usageCount: { increment: 1 } },
    });

    return apiSuccess(template);
  } catch (error) {
    logError('Failed to increment template usage', error);
    return apiError('Không thể cập nhật', 500);
  }
}
