/**
 * Inventory SLA Settings API Route
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ProductSlaSettings } from '@/features/settings/inventory/types';

const SETTINGS_KEY = 'inventory-sla-settings';
const SETTINGS_GROUP = 'inventory';

const defaultSettings: ProductSlaSettings = {
  defaultReorderLevel: 10,
  defaultSafetyStock: 5,
  defaultMaxStock: 100,
  deadStockDays: 90,
  slowMovingDays: 30,
  enableEmailAlerts: false,
  alertEmailRecipients: [],
  alertFrequency: 'daily',
  showOnDashboard: true,
  dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
};

export async function GET() {
  try {
    const setting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY },
    });

    if (!setting) {
      return NextResponse.json({ data: defaultSettings });
    }

    const data = setting.value as ProductSlaSettings;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API] Error fetching inventory SLA settings:', error);
    return NextResponse.json({ data: defaultSettings });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const updatedSettings: ProductSlaSettings = {
      ...defaultSettings,
      ...body,
    };

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
      update: {
        value: updatedSettings as object,
        updatedAt: new Date(),
      },
      create: {
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'inventory',
        value: updatedSettings as object,
      },
    });

    return NextResponse.json(setting.value as ProductSlaSettings);
  } catch (error) {
    console.error('[API] Error updating inventory SLA settings:', error);
    return NextResponse.json(
      { error: 'Failed to update SLA settings' },
      { status: 500 }
    );
  }
}
