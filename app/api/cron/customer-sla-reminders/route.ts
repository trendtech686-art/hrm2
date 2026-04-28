/**
 * Customer SLA Reminders Cron
 * GET /api/cron/customer-sla-reminders
 *
 * Runs daily to check for customers with SLA breaches:
 * - follow-up: chưa liên hệ khách hàng quá targetDays
 * - re-engagement: khách không mua hàng quá targetDays
 * - debt-payment: khách có công nợ quá hạn
 * Protected by CRON_SECRET.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { createBulkNotifications } from '@/lib/notifications';
import { apiSuccess, apiError } from '@/lib/api-utils';

export const maxDuration = 60;

interface SlaConfig {
  slaType: string;
  name: string;
  targetDays: number;
  warningDays: number;
  criticalDays: number;
}

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return process.env.NODE_ENV === 'development';
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return apiError('Unauthorized', 401);
  }

  try {
    const slaSettingsRaw = await prisma.customerSetting.findMany({
      where: { type: 'sla-setting', isActive: true, isDeleted: false },
      select: { name: true, metadata: true },
    });

    if (slaSettingsRaw.length === 0) {
      return apiSuccess({ skipped: true, reason: 'No active SLA settings' });
    }

    const slaConfigs: SlaConfig[] = slaSettingsRaw
      .map(s => {
        const meta = s.metadata as Record<string, unknown> | null;
        if (!meta?.slaType || !meta?.targetDays) return null;
        return {
          slaType: String(meta.slaType),
          name: s.name,
          targetDays: Number(meta.targetDays),
          warningDays: Number(meta.warningDays ?? 0),
          criticalDays: Number(meta.criticalDays ?? 0),
        };
      })
      .filter((c): c is SlaConfig => c !== null);

    const followUpSla = slaConfigs.find(c => c.slaType === 'follow-up');
    const reEngageSla = slaConfigs.find(c => c.slaType === 're-engagement');
    const debtSla = slaConfigs.find(c => c.slaType === 'debt-payment');

    const now = new Date();
    const overdueFollowUp: string[] = [];
    const overdueReEngage: string[] = [];
    const overdueDebt: string[] = [];
    const assigneeNotify = new Set<string>();

    // 2. Follow-up SLA: customers not contacted within targetDays
    if (followUpSla) {
      const cutoff = new Date(now.getTime() - followUpSla.targetDays * 24 * 60 * 60 * 1000);
      const customers = await prisma.customer.findMany({
        where: {
          isDeleted: false,
          status: 'ACTIVE',
          OR: [
            { lastContactDate: { lt: cutoff } },
            { lastContactDate: null, createdAt: { lt: cutoff } },
          ],
        },
        select: { systemId: true, id: true, name: true, followUpAssigneeId: true },
        take: 200,
      });
      for (const c of customers) {
        overdueFollowUp.push(`${c.id} (${c.name})`);
        if (c.followUpAssigneeId) assigneeNotify.add(c.followUpAssigneeId);
      }
    }

    // 3. Re-engagement SLA: inactive customers who haven't purchased within targetDays
    if (reEngageSla) {
      const cutoff = new Date(now.getTime() - reEngageSla.targetDays * 24 * 60 * 60 * 1000);
      const customers = await prisma.customer.findMany({
        where: {
          isDeleted: false,
          status: 'ACTIVE',
          totalOrders: { gt: 0 },
          lastPurchaseDate: { lt: cutoff },
        },
        select: { systemId: true, id: true, name: true, followUpAssigneeId: true },
        take: 200,
      });
      for (const c of customers) {
        overdueReEngage.push(`${c.id} (${c.name})`);
        if (c.followUpAssigneeId) assigneeNotify.add(c.followUpAssigneeId);
      }
    }

    // 4. Debt SLA: customers with outstanding debt
    if (debtSla) {
      const customers = await prisma.customer.findMany({
        where: {
          isDeleted: false,
          currentDebt: { gt: 0 },
        },
        select: { systemId: true, id: true, name: true, currentDebt: true, followUpAssigneeId: true },
        take: 200,
      });
      for (const c of customers) {
        overdueDebt.push(`${c.id} (${c.name})`);
        if (c.followUpAssigneeId) assigneeNotify.add(c.followUpAssigneeId);
      }
    }

    const total = overdueFollowUp.length + overdueReEngage.length + overdueDebt.length;
    if (total === 0) {
      return apiSuccess({ count: 0 });
    }

    // 5. Get managers
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

    // 6. Build consolidated notification
    const parts: string[] = [];
    if (overdueFollowUp.length > 0) {
      parts.push(`📞 ${overdueFollowUp.length} cần liên hệ lại`);
    }
    if (overdueReEngage.length > 0) {
      parts.push(`🔄 ${overdueReEngage.length} cần kích hoạt lại`);
    }
    if (overdueDebt.length > 0) {
      parts.push(`💰 ${overdueDebt.length} có công nợ cần nhắc`);
    }

    await createBulkNotifications({
      type: 'customer',
      title: `⏰ ${total} khách hàng cần chăm sóc`,
      message: parts.join(' • '),
      link: '/customers?tab=sla',
      recipientIds: allRecipients,
    });

    return apiSuccess({
      overdueFollowUp: overdueFollowUp.length,
      overdueReEngage: overdueReEngage.length,
      overdueDebt: overdueDebt.length,
      notified: allRecipients.length,
    });
  } catch (error) {
    logError('[Cron] Customer SLA reminders failed', error);
    return apiError('Internal error', 500);
  }
}
