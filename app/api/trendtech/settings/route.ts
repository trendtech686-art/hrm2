/**
 * Trendtech Settings API Route
 * GET - Fetch settings
 * PATCH - Update specific sections
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'

const SETTINGS_KEY = 'settings';
const SETTINGS_GROUP = 'trendtech';

export async function GET() {
  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
      },
    });
    return NextResponse.json({ success: true, data: setting?.value || {} });
  } catch (error) {
    logError('[API] Error fetching Trendtech settings', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa đăng nhập', 401)

  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section is required' },
        { status: 400 }
      );
    }

    // Get existing settings
    const existingSetting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY, group: SETTINGS_GROUP },
    });

    const currentValue = (existingSetting?.value as Record<string, unknown>) || {};
    const oldSectionValue = currentValue[section];
    const updatedValue = { ...currentValue, [section]: data };

    // Update specific section
    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
      create: {
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'integration',
        value: updatedValue,
      },
      update: {
        value: updatedValue,
      },
    });

    // Log changes
    if (JSON.stringify(oldSectionValue) !== JSON.stringify(data)) {
      createActivityLog({
        entityType: 'trendtech_settings',
        entityId: 'trendtech-settings',
        action: `Cập nhật cài đặt Trendtech: ${section}`,
        actionType: 'update',
        changes: { [section]: { from: oldSectionValue ?? null, to: data } },
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[trendtech/settings] activity log failed', e));
    }

    // Invalidate server-side settings cache
    cache.deletePattern('^settings:');

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('[API] Error updating Trendtech settings', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
