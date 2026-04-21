/**
 * Daily Summary Email Cron
 * GET /api/cron/daily-summary
 *
 * Runs daily at 7:00 AM (Vietnam time) to send summary email to admins.
 * Protected by CRON_SECRET (Vercel cron header).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { logError } from '@/lib/logger';
import { getSystemNotificationSettings, areEmailNotificationsEnabled } from '@/lib/notifications';

export const maxDuration = 60;

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV === 'development';
  }

  return authHeader === `Bearer ${cronSecret}`;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function statRow(label: string, count: number, color: string, link?: string): string {
  const countHtml = link
    ? `<a href="${APP_URL}${link}" style="color: ${color}; font-weight: 700; text-decoration: none; font-size: 20px;">${count}</a>`
    : `<span style="color: ${color}; font-weight: 700; font-size: 20px;">${count}</span>`;

  return `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6;">${label}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; text-align: right;">${countHtml}</td>
    </tr>
  `;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Respect master email switch (Cài đặt → Thông báo → Chung)
    if (!(await areEmailNotificationsEnabled())) {
      return NextResponse.json({ success: true, skipped: true, reason: 'master email switch off' });
    }

    const settings = await getSystemNotificationSettings();
    if (!settings.dailySummaryEmail) {
      return NextResponse.json({ success: true, skipped: true, reason: 'dailySummaryEmail disabled' });
    }

    // Gather daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayOrders,
      pendingWarranties,
      openComplaints,
      overdueTasks,
      todayRevenue,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: today, lt: tomorrow } },
      }),
      prisma.warranty.count({
        where: { status: { in: ['RECEIVED', 'PROCESSING', 'WAITING_PARTS'] } },
      }),
      prisma.complaint.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
      }),
      prisma.task.count({
        where: {
          dueDate: { lt: today },
          status: { notIn: ['DONE', 'CANCELLED'] },
        },
      }).catch(() => 0), // task table might not exist
      prisma.order.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow } },
        _sum: { grandTotal: true },
      }).then(r => Number(r._sum?.grandTotal || 0)).catch(() => 0),
    ]);

    // Get admin/manager employees with email
    const adminEmployees = await prisma.employee.findMany({
      where: {
        employmentStatus: 'ACTIVE',
        role: { in: ['Admin', 'Quản lý', 'admin', 'ADMIN', 'manager', 'MANAGER'] },
        OR: [
          { workEmail: { not: null } },
          { personalEmail: { not: null } },
        ],
      },
      select: { workEmail: true, personalEmail: true, fullName: true },
    });

    const recipientEmails = adminEmployees
      .map(e => e.workEmail || e.personalEmail)
      .filter((email): email is string => !!email);

    if (recipientEmails.length === 0) {
      return NextResponse.json({ success: true, skipped: true, reason: 'No admin emails' });
    }

    const formattedRevenue = new Intl.NumberFormat('vi-VN').format(todayRevenue);
    const dateStr = new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(new Date());

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e40af; margin-bottom: 4px;">📊 Báo cáo tổng hợp ngày</h2>
        <p style="color: #6b7280; margin-top: 0;">${dateStr}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; background: #f9fafb; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #1e40af;">
              <th style="padding: 10px 16px; text-align: left; color: white; font-weight: 600;">Chỉ số</th>
              <th style="padding: 10px 16px; text-align: right; color: white; font-weight: 600;">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            ${statRow('Đơn hàng hôm nay', todayOrders, '#2563eb', '/orders')}
            ${statRow(`Doanh thu hôm nay`, 0, '#059669', '/orders').replace('>0<', `>${formattedRevenue}₫<`)}
            ${statRow('Bảo hành đang chờ', pendingWarranties, pendingWarranties > 0 ? '#f59e0b' : '#059669', '/warranty')}
            ${statRow('Khiếu nại đang mở', openComplaints, openComplaints > 0 ? '#f59e0b' : '#059669', '/complaint-tracking')}
            ${statRow('Công việc quá hạn', overdueTasks, overdueTasks > 0 ? '#dc2626' : '#059669', '/tasks')}
          </tbody>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${APP_URL}" style="background: #2563eb; color: white; padding: 10px 32px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Truy cập hệ thống
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">
          Đây là email tổng hợp tự động. Bạn có thể tắt trong Cài đặt → Thông báo → Hệ thống.
        </p>
      </div>
    `;

    let sent = 0;
    for (const email of recipientEmails) {
      const ok = await sendEmail({
        to: email,
        subject: `[Báo cáo] Tổng hợp ngày ${new Intl.DateTimeFormat('vi-VN').format(new Date())}`,
        html,
      });
      if (ok) sent++;
    }

    return NextResponse.json({ success: true, sent, total: recipientEmails.length });
  } catch (error) {
    logError('[Cron] Daily summary failed', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
