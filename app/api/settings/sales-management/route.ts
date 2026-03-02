/**
 * Sales Management Settings API Route
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError } from '@/lib/api-utils';

type PrintCopiesOption = '1' | '2' | '3';

type SalesManagementSettingsValues = {
  allowCancelAfterExport: boolean;
  allowNegativeOrder: boolean;
  allowNegativeApproval: boolean;
  allowNegativePacking: boolean;
  allowNegativeStockOut: boolean;
  printCopies: PrintCopiesOption;
};

const SETTINGS_KEY = 'sales-management-settings';
const SETTINGS_GROUP = 'sales';

const defaultSettings: SalesManagementSettingsValues = {
  allowCancelAfterExport: true,
  allowNegativeOrder: true,
  allowNegativeApproval: true,
  allowNegativePacking: true,
  allowNegativeStockOut: true,
  printCopies: '1',
};

export async function GET() {
  try {
    const setting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY },
    });

    if (!setting) {
      return NextResponse.json({ data: defaultSettings });
    }

    const data = setting.value as SalesManagementSettingsValues;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API] Error fetching sales management settings:', error);
    return NextResponse.json({ data: defaultSettings });
  }
}

export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa đăng nhập', 401)

  try {
    const body = await request.json();
    
    const updatedSettings: SalesManagementSettingsValues = {
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
        category: 'sales',
        value: updatedSettings as object,
      },
    });

    return NextResponse.json(setting.value as SalesManagementSettingsValues);
  } catch (error) {
    console.error('[API] Error updating sales management settings:', error);
    return NextResponse.json(
      { error: 'Failed to update sales management settings' },
      { status: 500 }
    );
  }
}
