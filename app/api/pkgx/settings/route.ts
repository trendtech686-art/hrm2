/**
 * PKGX Settings API Route
 * GET - Fetch settings
 * PATCH - Update specific sections
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SETTINGS_KEY = 'settings';
const SETTINGS_GROUP = 'pkgx';

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
    console.error('[API] Error fetching PKGX settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error updating PKGX settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
