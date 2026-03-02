/**
 * Logistics Settings API Route
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError } from '@/lib/api-utils';
import type { ProductLogisticsSettings, LogisticsPreset } from '@/features/settings/inventory/types';

const SETTINGS_KEY = 'logistics-settings';
const SETTINGS_GROUP = 'inventory';

const createPreset = (overrides: Partial<LogisticsPreset>): LogisticsPreset => ({
  weight: overrides.weight ?? 0,
  weightUnit: overrides.weightUnit ?? 'g',
  length: overrides.length ?? 0,
  width: overrides.width ?? 0,
  height: overrides.height ?? 0,
});

const defaultSettings: ProductLogisticsSettings = {
  physicalDefaults: createPreset({ weight: 500, length: 30, width: 20, height: 10 }),
  comboDefaults: createPreset({ weight: 1000, length: 35, width: 25, height: 15 }),
};

export async function GET() {
  try {
    const setting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY },
    });

    if (!setting) {
      return NextResponse.json({ data: defaultSettings });
    }

    const data = setting.value as unknown as ProductLogisticsSettings;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API] Error fetching logistics settings:', error);
    return NextResponse.json({ data: defaultSettings });
  }
}

export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa đăng nhập', 401)

  try {
    const body = await request.json();
    
    const updatedSettings: ProductLogisticsSettings = {
      physicalDefaults: {
        ...defaultSettings.physicalDefaults,
        ...(body.physicalDefaults ?? {}),
      },
      comboDefaults: {
        ...defaultSettings.comboDefaults,
        ...(body.comboDefaults ?? {}),
      },
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

    return NextResponse.json(setting.value as unknown as ProductLogisticsSettings);
  } catch (error) {
    console.error('[API] Error updating logistics settings:', error);
    return NextResponse.json(
      { error: 'Failed to update logistics settings' },
      { status: 500 }
    );
  }
}
