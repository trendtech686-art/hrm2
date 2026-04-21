/**
 * Warranty Reminders Cron
 * GET /api/cron/warranty-reminders
 *
 * Runs every 4 hours to check for overdue warranties and send reminder notifications.
 * Uses SLA settings from warranty module.
 * Protected by CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { createBulkNotifications } from '@/lib/notifications';
import { notifyWarrantyOverdue } from '@/lib/warranty-notifications';

export const maxDuration = 60;

interface SlaPriorityTarget {
  responseTime: number;
  resolveTime: number;
}

interface SlaTargets {
  low: SlaPriorityTarget;
  medium: SlaPriorityTarget;
  high: SlaPriorityTarget;
  urgent: SlaPriorityTarget;
}

interface NotificationSettings {
  emailOnOverdue: boolean;
  reminderNotifications: boolean;
}

const defaultSLA: SlaTargets = {
  low: { responseTime: 480, resolveTime: 72 },
  medium: { responseTime: 240, resolveTime: 48 },
  high: { responseTime: 120, resolveTime: 24 },
  urgent: { responseTime: 60, resolveTime: 12 },
};

const defaultNotifications: NotificationSettings = {
  emailOnOverdue: true,
  reminderNotifications: true,
};

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return process.env.NODE_ENV === 'development';
  return authHeader === `Bearer ${cronSecret}`;
}

async function getSettings() {
  try {
    const [slaSetting, notifSetting] = await Promise.all([
      prisma.setting.findUnique({
        where: { key_group: { key: 'warranty_sla_targets', group: 'warranty' } },
      }),
      prisma.setting.findUnique({
        where: { key_group: { key: 'warranty_notification_settings', group: 'warranty' } },
      }),
    ]);

    const sla: SlaTargets = slaSetting?.value
      ? { ...defaultSLA, ...(slaSetting.value as Partial<SlaTargets>) }
      : defaultSLA;

    const notifications: NotificationSettings = notifSetting?.value
      ? { ...defaultNotifications, ...(notifSetting.value as Partial<NotificationSettings>) }
      : defaultNotifications;

    return { sla, notifications };
  } catch {
    return { sla: defaultSLA, notifications: defaultNotifications };
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sla, notifications } = await getSettings();

    if (!notifications.reminderNotifications) {
      return NextResponse.json({ success: true, skipped: true, reason: 'Reminders disabled' });
    }

    const now = new Date();

    // Find open warranties
    const openWarranties = await prisma.warranty.findMany({
      where: {
        isDeleted: false,
        status: { in: ['RECEIVED', 'PROCESSING', 'WAITING_PARTS'] },
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

    if (openWarranties.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // Classify overdue warranties
    const overdueResponse: string[] = [];
    const overdueResolve: string[] = [];
    const assigneeNotify = new Set<string>();

    // Map priority enum (UPPERCASE) to SLA key (lowercase)
    const priorityToKey: Record<string, keyof SlaTargets> = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      URGENT: 'urgent',
    };

    for (const w of openWarranties) {
      const elapsedMinutes = (now.getTime() - w.createdAt.getTime()) / (1000 * 60);
      const elapsedHours = elapsedMinutes / 60;
      const slaKey = priorityToKey[w.priority] ?? 'medium';
      const prioritySla = sla[slaKey];

      if (elapsedHours > prioritySla.resolveTime) {
        overdueResolve.push(`${w.id} (${w.customerName})`);
      } else if (elapsedMinutes > prioritySla.responseTime) {
        overdueResponse.push(`${w.id} (${w.customerName})`);
      } else {
        continue;
      }

      if (w.assigneeId) assigneeNotify.add(w.assigneeId);
    }

    const totalOverdue = overdueResponse.length + overdueResolve.length;
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
    if (overdueResolve.length > 0) {
      parts.push(`🟠 ${overdueResolve.length} quá hạn giải quyết`);
    }
    if (overdueResponse.length > 0) {
      parts.push(`🟡 ${overdueResponse.length} quá hạn phản hồi`);
    }

    await createBulkNotifications({
      type: 'warranty',
      title: `⏰ ${totalOverdue} bảo hành quá hạn`,
      message: parts.join(' • '),
      link: '/warranty?sort=createdAt&order=asc',
      recipientIds: allRecipients,
      settingsKey: 'warranty:overdue',
    });

    // Send individual overdue emails to assignees (fire-and-forget)
    const overdueWarranties = openWarranties.filter(w => {
      const elapsedHours = (now.getTime() - w.createdAt.getTime()) / (1000 * 60 * 60);
      const slaKey = priorityToKey[w.priority] ?? 'medium';
      return elapsedHours > sla[slaKey].resolveTime && w.assigneeId;
    });

    for (const w of overdueWarranties) {
      const slaKey = priorityToKey[w.priority] ?? 'medium';
      const dueDate = new Date(w.createdAt.getTime() + sla[slaKey].resolveTime * 60 * 60 * 1000);
      const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      notifyWarrantyOverdue({
        systemId: w.systemId,
        title: w.title,
        id: w.id,
        assigneeId: w.assigneeId,
        dueDate,
        daysLeft,
      }).catch(() => {}); // fire-and-forget
    }

    return NextResponse.json({
      success: true,
      overdueResponse: overdueResponse.length,
      overdueResolve: overdueResolve.length,
      notified: allRecipients.length,
    });
  } catch (error) {
    logError('[Cron] Warranty reminders failed', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
