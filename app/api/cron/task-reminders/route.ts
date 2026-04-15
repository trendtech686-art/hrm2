/**
 * Task Reminders Cron
 * GET /api/cron/task-reminders
 *
 * Runs every 4 hours to check for overdue tasks and send reminder notifications.
 * Uses SLA and reminder settings from tasks module.
 * Protected by CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { createBulkNotifications } from '@/lib/notifications';
import { defaultSLA, defaultReminders } from '@/features/settings/tasks/types';
import type { SLASettings, ReminderSettings } from '@/features/settings/tasks/types';

export const maxDuration = 60;

/** Map Prisma TaskPriority enum → Vietnamese SLA keys */
const PRIORITY_TO_SLA: Record<string, keyof SLASettings> = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  URGENT: 'Khẩn cấp',
};

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return process.env.NODE_ENV === 'development';
  return authHeader === `Bearer ${cronSecret}`;
}

async function getSettings() {
  try {
    const [slaSetting, reminderSetting] = await Promise.all([
      prisma.setting.findUnique({
        where: { key_group: { key: 'tasks_sla_settings', group: 'tasks' } },
      }),
      prisma.setting.findUnique({
        where: { key_group: { key: 'tasks_reminder_settings', group: 'tasks' } },
      }),
    ]);

    const sla: SLASettings = slaSetting?.value
      ? { ...defaultSLA, ...(slaSetting.value as Partial<SLASettings>) }
      : defaultSLA;

    const reminders: ReminderSettings = reminderSetting?.value
      ? { ...defaultReminders, ...(reminderSetting.value as Partial<ReminderSettings>) }
      : defaultReminders;

    return { sla, reminders };
  } catch {
    return { sla: defaultSLA, reminders: defaultReminders };
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sla, reminders } = await getSettings();

    if (!reminders.enabled) {
      return NextResponse.json({ success: true, skipped: true, reason: 'Reminders disabled' });
    }

    const now = new Date();

    // Find open tasks (TODO, IN_PROGRESS, REVIEW)
    const openTasks = await prisma.task.findMany({
      where: {
        isDeleted: false,
        status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] },
      },
      select: {
        systemId: true,
        id: true,
        title: true,
        priority: true,
        status: true,
        assigneeId: true,
        creatorId: true,
        createdAt: true,
        dueDate: true,
      },
      take: 500,
    });

    if (openTasks.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const overdueResponse: string[] = [];
    const overdueDueDate: string[] = [];
    const escalations: string[] = [];
    const assigneeNotify = new Set<string>();

    for (const t of openTasks) {
      const slaKey = PRIORITY_TO_SLA[t.priority] ?? 'Trung bình';
      const prioritySla = sla[slaKey] ?? sla['Trung bình'];
      const elapsedMinutes = (now.getTime() - t.createdAt.getTime()) / (1000 * 60);
      const label = `${t.id} (${t.title.slice(0, 30)})`;

      let isOverdue = false;

      // Check escalation: past dueDate + escalationHours
      if (t.dueDate && now.getTime() > t.dueDate.getTime() + reminders.escalationHours * 60 * 60 * 1000) {
        escalations.push(label);
        isOverdue = true;
      }
      // Check overdue: past dueDate OR past completeTime from SLA
      else if (
        (t.dueDate && now > t.dueDate) ||
        (elapsedMinutes > prioritySla.completeTime * 60)
      ) {
        overdueDueDate.push(label);
        isOverdue = true;
      }
      // Check overdue response: still TODO and past responseTime
      else if (t.status === 'TODO' && elapsedMinutes > prioritySla.responseTime) {
        overdueResponse.push(label);
        isOverdue = true;
      }

      if (isOverdue && t.assigneeId) {
        assigneeNotify.add(t.assigneeId);
      }
    }

    const totalOverdue = overdueResponse.length + overdueDueDate.length + escalations.length;
    if (totalOverdue === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // Get admin/manager IDs
    const managers = await prisma.employee.findMany({
      where: {
        employmentStatus: 'ACTIVE',
        role: { in: ['Admin', 'Quản lý', 'admin', 'ADMIN', 'manager', 'MANAGER'] },
      },
      select: { systemId: true },
    });
    const managerIds = managers.map(e => e.systemId);
    const allRecipients = Array.from(new Set([...managerIds, ...assigneeNotify]));

    if (allRecipients.length === 0) {
      return NextResponse.json({ success: true, skipped: true, reason: 'No recipients' });
    }

    // Build consolidated message
    const parts: string[] = [];
    if (escalations.length > 0) {
      parts.push(`🔴 ${escalations.length} cần escalation: ${escalations.slice(0, 3).join(', ')}${escalations.length > 3 ? '...' : ''}`);
    }
    if (overdueDueDate.length > 0) {
      parts.push(`🟠 ${overdueDueDate.length} quá hạn hoàn thành`);
    }
    if (overdueResponse.length > 0) {
      parts.push(`🟡 ${overdueResponse.length} chưa được tiếp nhận`);
    }

    await createBulkNotifications({
      type: 'task',
      title: `⏰ ${totalOverdue} công việc quá hạn`,
      message: parts.join(' • '),
      link: '/tasks?sort=dueDate&order=asc',
      recipientIds: allRecipients,
    });

    return NextResponse.json({
      success: true,
      overdueResponse: overdueResponse.length,
      overdueDueDate: overdueDueDate.length,
      escalations: escalations.length,
      notified: allRecipients.length,
    });
  } catch (error) {
    logError('[Cron] Task reminders failed', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
