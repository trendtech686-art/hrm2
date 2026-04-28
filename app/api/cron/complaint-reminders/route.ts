/**
 * Complaint Reminders Cron
 * GET /api/cron/complaint-reminders
 *
 * Runs every 4 hours to check for overdue complaints and send reminder notifications.
 * Uses SLA and reminder settings from complaints module.
 * Protected by CRON_SECRET.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { createBulkNotifications } from '@/lib/notifications';
import { notifyComplaintOverdue } from '@/lib/complaint-notifications';
import { defaultSLA, defaultReminders } from '@/features/settings/complaints/types';
import type { SLASettings, ReminderSettings } from '@/features/settings/complaints/types';
import { apiSuccess, apiError } from '@/lib/api-utils';

export const maxDuration = 60;

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
        where: { key_group: { key: 'complaints_sla_settings', group: 'complaints' } },
      }),
      prisma.setting.findUnique({
        where: { key_group: { key: 'complaints_reminder_settings', group: 'complaints' } },
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
    return apiError('Unauthorized', 401);
  }

  try {
    const { sla, reminders } = await getSettings();

    if (!reminders.enabled) {
      return apiSuccess({ skipped: true, reason: 'Reminders disabled' });
    }

    const now = new Date();
    const escalationThreshold = new Date(now.getTime() - reminders.escalationHours * 60 * 60 * 1000);

    // Find open complaints
    const openComplaints = await prisma.complaint.findMany({
      where: {
        isDeleted: false,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
      select: {
        systemId: true,
        id: true,
        title: true,
        priority: true,
        status: true,
        assigneeId: true,
        customerName: true,
        createdAt: true,
      },
      take: 500,
    });

    if (openComplaints.length === 0) {
      return apiSuccess({ count: 0 });
    }

    // Classify overdue complaints
    const overdueResponse: string[] = [];
    const overdueResolve: string[] = [];
    const escalations: string[] = [];
    const assigneeNotify = new Set<string>();

    for (const c of openComplaints) {
      const elapsedMinutes = (now.getTime() - c.createdAt.getTime()) / (1000 * 60);
      const elapsedHours = elapsedMinutes / 60;
      const prioritySla = sla[c.priority as keyof SLASettings] ?? sla.MEDIUM;

      if (c.createdAt <= escalationThreshold) {
        escalations.push(`${c.id} (${c.customerName})`);
      } else if (elapsedHours > prioritySla.resolveTime) {
        overdueResolve.push(`${c.id} (${c.customerName})`);
      } else if (elapsedMinutes > prioritySla.responseTime) {
        overdueResponse.push(`${c.id} (${c.customerName})`);
      } else {
        continue;
      }

      if (c.assigneeId) assigneeNotify.add(c.assigneeId);
    }

    const totalOverdue = overdueResponse.length + overdueResolve.length + escalations.length;
    if (totalOverdue === 0) {
      return apiSuccess({ count: 0 });
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
      return apiSuccess({ skipped: true, reason: 'No recipients' });
    }

    // Build consolidated message
    const parts: string[] = [];
    if (escalations.length > 0) {
      parts.push(`🔴 ${escalations.length} cần escalation: ${escalations.slice(0, 3).join(', ')}${escalations.length > 3 ? '...' : ''}`);
    }
    if (overdueResolve.length > 0) {
      parts.push(`🟠 ${overdueResolve.length} quá hạn giải quyết`);
    }
    if (overdueResponse.length > 0) {
      parts.push(`🟡 ${overdueResponse.length} quá hạn phản hồi`);
    }

    await createBulkNotifications({
      type: 'complaint',
      title: `⏰ ${totalOverdue} khiếu nại quá hạn`,
      message: parts.join(' • '),
      link: '/complaints?sort=createdAt&order=asc',
      recipientIds: allRecipients,
      settingsKey: 'complaint:overdue',
    });

    // Send individual overdue emails to assignees (fire-and-forget)
    const overdueComplaints = openComplaints.filter(c => {
      const elapsedHours = (now.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60);
      const prioritySla = sla[c.priority as keyof SLASettings] ?? sla.MEDIUM;
      return elapsedHours > prioritySla.resolveTime && c.assigneeId;
    });

    for (const c of overdueComplaints) {
      const prioritySla = sla[c.priority as keyof SLASettings] ?? sla.MEDIUM;
      const dueDate = new Date(c.createdAt.getTime() + prioritySla.resolveTime * 60 * 60 * 1000);
      const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      notifyComplaintOverdue({
        systemId: c.systemId,
        title: c.title,
        id: c.id,
        assigneeId: c.assigneeId,
        dueDate,
        daysLeft,
      }).catch(() => {}); // fire-and-forget
    }

    return apiSuccess({
      overdueResponse: overdueResponse.length,
      overdueResolve: overdueResolve.length,
      escalations: escalations.length,
      notified: allRecipients.length,
    });
  } catch (error) {
    logError('[Cron] Complaint reminders failed', error);
    return apiError('Internal error', 500);
  }
}
