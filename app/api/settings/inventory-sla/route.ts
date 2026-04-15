/**
 * Inventory SLA Settings API Route
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils';
import type { ProductSlaSettings } from '@/features/settings/inventory/types';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY },
    });

    if (!setting) {
      return apiSuccess({ data: defaultSettings });
    }

    const data = setting.value as ProductSlaSettings;
    return apiSuccess({ data });
  } catch (error) {
    logError('[API] Error fetching inventory SLA settings', error);
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
    const oldSettings = existingSetting ? (existingSetting.value as ProductSlaSettings) : defaultSettings;
    
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
        systemId: await generateIdWithPrefix('SET_INVSLA', prisma),
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'inventory',
        value: updatedSettings as object,
      },
    });

    cache.deletePattern('^settings:')

    // Activity log with diff
    const fieldLabels: Record<string, string> = {
      defaultReorderLevel: 'Mức đặt lại mặc định',
      defaultSafetyStock: 'Tồn kho an toàn',
      defaultMaxStock: 'Tồn kho tối đa',
      deadStockDays: 'Số ngày tồn đọng',
      slowMovingDays: 'Số ngày chậm luân chuyển',
      enableEmailAlerts: 'Gửi email cảnh báo',
      alertFrequency: 'Tần suất cảnh báo',
      showOnDashboard: 'Hiển thị trên Dashboard',
    }
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    for (const [key, label] of Object.entries(fieldLabels)) {
      const oldVal = oldSettings[key as keyof ProductSlaSettings]
      const newVal = updatedSettings[key as keyof ProductSlaSettings]
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        if (typeof oldVal === 'boolean') {
          changes[label] = { from: oldVal ? 'Bật' : 'Tắt', to: (newVal as boolean) ? 'Bật' : 'Tắt' }
        } else {
          changes[label] = { from: oldVal, to: newVal }
        }
      }
    }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'inventory_sla_settings',
        entityId: setting.systemId,
        action: `Cập nhật cảnh báo tồn kho: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ data: setting.value as ProductSlaSettings });
  } catch (error) {
    logError('[API] Error updating inventory SLA settings', error);
    return apiError('Failed to update SLA settings', 500);
  }
}
