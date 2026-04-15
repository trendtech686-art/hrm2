/**
 * Stock Alerts Cron
 * GET /api/cron/stock-alerts
 *
 * Runs daily to check for low stock products and send notifications.
 * Uses defaultReorderLevel from SLA settings (default: 10).
 * Protected by CRON_SECRET (Vercel cron header).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { getWarehouseNotificationSettings, createBulkNotifications } from '@/lib/notifications';
import { defaultSlaSettings } from '@/features/settings/inventory/sla-settings-service';
import type { ProductSlaSettings } from '@/features/settings/inventory/types';

/** Read SLA settings from DB (server-side, with fallback) */
async function getSlaSettings(): Promise<ProductSlaSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'inventory-sla-settings', group: 'inventory' } },
    });
    if (!setting?.value) return defaultSlaSettings;
    return { ...defaultSlaSettings, ...(setting.value as Partial<ProductSlaSettings>) };
  } catch {
    return defaultSlaSettings;
  }
}

export const maxDuration = 60;

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV === 'development';
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getWarehouseNotificationSettings();
    if (!settings.lowStockAlert) {
      return NextResponse.json({ success: true, skipped: true, reason: 'lowStockAlert disabled' });
    }

    const slaSettings = await getSlaSettings();
    const threshold = slaSettings.defaultReorderLevel;

    // Find products with stock below threshold
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isStockTracked: true,
        status: 'ACTIVE',
        totalAvailable: { lte: threshold },
      },
      select: {
        systemId: true,
        id: true,
        name: true,
        totalAvailable: true,
        totalInventory: true,
        reorderLevel: true,
      },
      orderBy: { totalAvailable: 'asc' },
      take: 100, // Limit to prevent huge notifications
    });

    if (lowStockProducts.length === 0) {
      return NextResponse.json({ success: true, count: 0, reason: 'No low stock products' });
    }

    // Get admin/manager employee IDs for notification
    const adminEmployees = await prisma.employee.findMany({
      where: {
        employmentStatus: 'ACTIVE',
        role: { in: ['Admin', 'Quản lý', 'admin', 'ADMIN', 'manager', 'MANAGER'] },
      },
      select: { systemId: true },
    });

    const recipientIds = adminEmployees.map(e => e.systemId);
    if (recipientIds.length === 0) {
      return NextResponse.json({ success: true, skipped: true, reason: 'No admin recipients' });
    }

    // Build notification message
    const criticalCount = lowStockProducts.filter(p => p.totalAvailable <= 0).length;
    const productNames = lowStockProducts
      .slice(0, 5)
      .map(p => `${p.name} (${p.totalAvailable})`)
      .join(', ');
    const suffix = lowStockProducts.length > 5 ? ` và ${lowStockProducts.length - 5} SP khác` : '';

    const result = await createBulkNotifications({
      type: 'inventory',
      title: `⚠️ ${lowStockProducts.length} sản phẩm tồn kho thấp`,
      message: criticalCount > 0
        ? `${criticalCount} SP hết hàng. ${productNames}${suffix}`
        : `Dưới ${threshold} SP: ${productNames}${suffix}`,
      link: '/products?sort=totalAvailable&order=asc',
      recipientIds,
      settingsKey: 'stock:low',
    });

    return NextResponse.json({
      success: true,
      lowStockCount: lowStockProducts.length,
      criticalCount,
      notified: result.count,
    });
  } catch (error) {
    logError('[Cron] Stock alerts failed', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
