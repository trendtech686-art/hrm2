/**
 * Global Settings API Route
 * Handles GET and PUT requests for global application settings
 * 
 * @module app/api/settings/global/route
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils';
import { defaultGlobalSettings, type GlobalSettings } from '@/features/settings/global/global-settings-service';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'

const SETTING_KEY = 'global';
const SETTING_GROUP = 'global';

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

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
      return apiSuccess(setting.value as unknown as GlobalSettings);
    }

    return apiSuccess(defaultGlobalSettings);
  } catch (error) {
    logError('GET /api/settings/global error', error);
    return apiSuccess(defaultGlobalSettings);
  }
}

export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa đăng nhập', 401)

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
        systemId: await generateIdWithPrefix('SET_GLOBAL', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'global',
        value: body as object,
      },
    });

    cache.deletePattern('^settings:')
    return apiSuccess(result.value as unknown as GlobalSettings);
  } catch (error) {
    logError('PUT /api/settings/global error', error);
    return apiError('Failed to update global settings', 500);
  }
}
