/**
 * Logistics Settings API Route
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils';
import type { ProductLogisticsSettings, LogisticsPreset } from '@/features/settings/inventory/types';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY },
    });

    if (!setting) {
      return apiSuccess({ data: defaultSettings });
    }

    const data = setting.value as unknown as ProductLogisticsSettings;
    return apiSuccess({ data });
  } catch (error) {
    logError('[API] Error fetching logistics settings', error);
    return apiSuccess({ data: defaultSettings });
  }
}

export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa đăng nhập', 401)

  try {
    const body = await request.json();

    // Read existing for diff
    const existingSetting = await prisma.setting.findFirst({ where: { key: SETTINGS_KEY } });
    const oldSettings = existingSetting ? (existingSetting.value as unknown as ProductLogisticsSettings) : defaultSettings;
    
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
        systemId: await generateIdWithPrefix('SET_LOGIS', prisma),
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'inventory',
        value: updatedSettings as object,
      },
    });

    cache.deletePattern('^settings:')

    // Activity log with diff
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const pOld = oldSettings.physicalDefaults
    const pNew = updatedSettings.physicalDefaults
    const cOld = oldSettings.comboDefaults
    const cNew = updatedSettings.comboDefaults
    if (pOld.weight !== pNew.weight) changes['Cân nặng SP vật lý'] = { from: pOld.weight, to: pNew.weight }
    if (pOld.length !== pNew.length) changes['Dài SP vật lý'] = { from: pOld.length, to: pNew.length }
    if (pOld.width !== pNew.width) changes['Rộng SP vật lý'] = { from: pOld.width, to: pNew.width }
    if (pOld.height !== pNew.height) changes['Cao SP vật lý'] = { from: pOld.height, to: pNew.height }
    if (cOld.weight !== cNew.weight) changes['Cân nặng Combo'] = { from: cOld.weight, to: cNew.weight }
    if (cOld.length !== cNew.length) changes['Dài Combo'] = { from: cOld.length, to: cNew.length }
    if (cOld.width !== cNew.width) changes['Rộng Combo'] = { from: cOld.width, to: cNew.width }
    if (cOld.height !== cNew.height) changes['Cao Combo'] = { from: cOld.height, to: cNew.height }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'logistics_settings',
        entityId: setting.systemId,
        action: `Cập nhật khối lượng & kích thước: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ data: setting.value as unknown as ProductLogisticsSettings });
  } catch (error) {
    logError('[API] Error updating logistics settings', error);
    return apiError('Failed to update logistics settings', 500);
  }
}
