/**
 * Sales Management Settings API Route
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY },
    });

    if (!setting) {
      return apiSuccess({ data: defaultSettings });
    }

    const data = setting.value as SalesManagementSettingsValues;
    return apiSuccess({ data });
  } catch (error) {
    logError('[API] Error fetching sales management settings', error);
    return apiSuccess({ data: defaultSettings });
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

    // Read old value for change tracking
    const oldSetting = await prisma.setting.findFirst({
      where: { key: SETTINGS_KEY, group: SETTINGS_GROUP },
    });
    const oldValue = (oldSetting?.value ?? defaultSettings) as Record<string, unknown>;

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
        systemId: await generateIdWithPrefix('SET_SALES', prisma),
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'sales',
        value: updatedSettings as object,
      },
    });

    // Log changes - labels tiếng Việt, boolean hiển thị Bật/Tắt
    const fieldLabels: Record<keyof SalesManagementSettingsValues, string> = {
      allowCancelAfterExport: 'Cho phép hủy đơn sau xuất kho',
      allowNegativeOrder: 'Cho phép tạo đơn đặt hàng âm',
      allowNegativeApproval: 'Cho phép duyệt đơn âm',
      allowNegativePacking: 'Cho phép đóng gói và tạo phiếu giao hàng âm',
      allowNegativeStockOut: 'Cho phép xuất kho âm',
      printCopies: 'In nhiều liên hoá đơn',
    }

    const formatValue = (key: keyof SalesManagementSettingsValues, val: unknown): string => {
      if (key === 'printCopies') return `In ${val} liên`
      return val ? 'Bật' : 'Tắt'
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {};
    for (const key of Object.keys(updatedSettings) as (keyof SalesManagementSettingsValues)[]) {
      if (JSON.stringify(oldValue[key]) !== JSON.stringify(updatedSettings[key])) {
        const label = fieldLabels[key] ?? key
        changes[label] = {
          from: formatValue(key, oldValue[key] ?? defaultSettings[key]),
          to: formatValue(key, updatedSettings[key]),
        }
      }
    }
    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'sales_management',
        entityId: 'sales-management-settings',
        action: `Cập nhật cài đặt bán hàng: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session?.user?.id ?? '',
      }).catch(e => logError('[sales-management] activity log failed', e));
    }

    cache.deletePattern('^settings:')
    return apiSuccess({ data: setting.value as SalesManagementSettingsValues });
  } catch (error) {
    logError('[API] Error updating sales management settings', error);
    return apiError('Failed to update sales management settings', 500);
  }
}
