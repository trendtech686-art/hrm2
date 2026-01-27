/**
 * Global Settings API Route
 * Handles GET and PUT requests for global application settings
 * 
 * @module app/api/settings/global/route
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultGlobalSettings, type GlobalSettings } from '@/features/settings/global/global-settings-service';

const SETTING_KEY = 'global';
const SETTING_GROUP = 'global';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
    });

    if (setting?.value) {
      return NextResponse.json(setting.value as unknown as GlobalSettings);
    }

    return NextResponse.json(defaultGlobalSettings);
  } catch (error) {
    console.error('GET /api/settings/global error:', error);
    return NextResponse.json(defaultGlobalSettings);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const result = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: body as object,
      },
      create: {
        systemId: `SET_GLOBAL_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'global',
        value: body as object,
      },
    });

    return NextResponse.json(result.value as unknown as GlobalSettings);
  } catch (error) {
    console.error('PUT /api/settings/global error:', error);
    return NextResponse.json(
      { error: 'Failed to update global settings' },
      { status: 500 }
    );
  }
}
