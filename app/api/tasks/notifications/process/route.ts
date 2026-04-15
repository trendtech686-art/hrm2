import { NextResponse } from 'next/server';
import { requirePermission, apiSuccess, apiError } from '@/lib/api-utils';
import { processTaskDeadlineNotifications } from '@/lib/task-notifications';
import { logError } from '@/lib/logger';

// POST - Process deadline notifications (call from cron/scheduled job)
export async function POST() {
  const result = await requirePermission('edit_tasks');
  if (result instanceof NextResponse) return result;

  try {
    const stats = await processTaskDeadlineNotifications();
    return apiSuccess(stats);
  } catch (error) {
    logError('Failed to process task notifications', error);
    return apiError('Không thể xử lý thông báo', 500);
  }
}
