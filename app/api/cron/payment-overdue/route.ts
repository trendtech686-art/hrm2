/**
 * Payment Overdue Cron
 * GET /api/cron/payment-overdue
 *
 * Runs daily to check for orders with overdue payments (UNPAID/PARTIAL).
 * Notifies salesperson and admins about orders older than 7 days with outstanding balance.
 * Protected by CRON_SECRET (Vercel cron header).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { getSystemNotificationSettings, createNotification } from '@/lib/notifications';

export const maxDuration = 60;

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV === 'development';
  }

  return authHeader === `Bearer ${cronSecret}`;
}

/** Number of days after orderDate to consider payment overdue */
const OVERDUE_DAYS = 7;

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getSystemNotificationSettings();
    if (!settings.paymentOverdue) {
      return NextResponse.json({ success: true, skipped: true, reason: 'paymentOverdue disabled' });
    }

    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - OVERDUE_DAYS);

    // Find orders with outstanding payments
    const overdueOrders = await prisma.order.findMany({
      where: {
        paymentStatus: { in: ['UNPAID', 'PARTIAL'] },
        status: { notIn: ['CANCELLED', 'RETURNED'] },
        orderDate: { lt: overdueDate },
      },
      select: {
        systemId: true,
        id: true,
        customerName: true,
        grandTotal: true,
        paidAmount: true,
        orderDate: true,
        salespersonId: true,
        salespersonName: true,
        paymentStatus: true,
      },
      orderBy: { orderDate: 'asc' },
      take: 100,
    });

    if (overdueOrders.length === 0) {
      return NextResponse.json({ success: true, count: 0, reason: 'No overdue payments' });
    }

    let notified = 0;

    // Group by salesperson for targeted notifications
    const bySalesperson = new Map<string, typeof overdueOrders>();
    for (const order of overdueOrders) {
      if (!order.salespersonId) continue;
      const existing = bySalesperson.get(order.salespersonId) || [];
      existing.push(order);
      bySalesperson.set(order.salespersonId, existing);
    }

    // Notify each salesperson about their overdue orders
    for (const [salespersonId, orders] of bySalesperson) {
      const totalOutstanding = orders.reduce(
        (sum, o) => sum + (Number(o.grandTotal) - Number(o.paidAmount)),
        0,
      );
      const formattedAmount = new Intl.NumberFormat('vi-VN').format(totalOutstanding);

      const orderList = orders
        .slice(0, 3)
        .map(o => o.id)
        .join(', ');
      const suffix = orders.length > 3 ? ` và ${orders.length - 3} đơn khác` : '';

      try {
        await createNotification({
          type: 'payment',
          title: `💰 ${orders.length} đơn hàng chưa thanh toán`,
          message: `Tổng nợ: ${formattedAmount}₫. Đơn: ${orderList}${suffix}`,
          link: '/orders?paymentStatus=UNPAID&sort=orderDate&order=asc',
          recipientId: salespersonId,
          settingsKey: 'payment:overdue',
        });
        notified++;
      } catch (error) {
        logError(`[Cron] Payment overdue notification failed for ${salespersonId}`, error);
      }
    }

    return NextResponse.json({
      success: true,
      overdueCount: overdueOrders.length,
      notified,
    });
  } catch (error) {
    logError('[Cron] Payment overdue failed', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
