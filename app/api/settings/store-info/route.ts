/**
 * Store Info Settings API
 * GET /api/settings/store-info - Fetch store info
 * PUT /api/settings/store-info - Update store info
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'

const STORE_INFO_KEY = 'store-info';
const STORE_INFO_GROUP = 'store';

// Default store info
const defaultStoreInfo = {
  companyName: '',
  brandName: '',
  logo: '',
  taxCode: '',
  registrationNumber: '',
  representativeName: '',
  representativeTitle: '',
  hotline: '',
  email: '',
  website: '',
  headquartersAddress: '',
  ward: '',
  district: '',
  province: '',
  note: '',
  bankAccountName: '',
  bankAccountNumber: '',
  bankName: '',
};

export async function GET() {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: STORE_INFO_KEY,
          group: STORE_INFO_GROUP,
        },
      },
    });

    if (!setting) {
      // Return default if not found
      return apiSuccess({
        ...defaultStoreInfo,
        updatedAt: null,
        updatedBySystemId: null,
        updatedByName: null,
      });
    }

    const value = setting.value as Record<string, unknown>;
    return apiSuccess({
      ...defaultStoreInfo,
      ...value,
      updatedAt: setting.updatedAt?.toISOString(),
      updatedBySystemId: setting.updatedBy,
      updatedByName: (value as { updatedByName?: string }).updatedByName || null,
    });
  } catch (error) {
    logError('Error fetching store info', error);
    return apiError('Failed to fetch store info', 500);
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    
    // Extract metadata
    const { updatedBySystemId, updatedByName, ...storeInfoData } = body;

    // Read old value for change tracking
    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key: STORE_INFO_KEY, group: STORE_INFO_GROUP } },
    });
    const oldValue = (oldSetting?.value ?? {}) as Record<string, unknown>;

    // Upsert the setting
    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: STORE_INFO_KEY,
          group: STORE_INFO_GROUP,
        },
      },
      update: {
        value: { ...storeInfoData, updatedByName },
        updatedBy: updatedBySystemId || session.user?.id,
      },
      create: {
        systemId: await generateIdWithPrefix('SET_STORE', prisma),
        key: STORE_INFO_KEY,
        group: STORE_INFO_GROUP,
        type: 'json',
        category: 'store',
        description: 'Thông tin cửa hàng',
        value: { ...storeInfoData, updatedByName },
        updatedBy: updatedBySystemId || session.user?.id,
      },
    });

    // Log changes
    const newValue = storeInfoData as Record<string, unknown>;
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    const allKeys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    for (const key of allKeys) {
      if (key === 'updatedByName') continue;
      if (JSON.stringify(oldValue[key]) !== JSON.stringify(newValue[key])) {
        changes[key] = { from: oldValue[key] ?? null, to: newValue[key] ?? null };
      }
    }
    if (Object.keys(changes).length > 0) {
      await createActivityLog({
        entityType: 'store_info',
        entityId: 'store-info',
        action: 'Cập nhật thông tin cửa hàng',
        actionType: 'update',
        changes,
        metadata: { userName: session.user?.name || session.user?.email },
        createdBy: session.user?.id,
      }).catch(e => logError('[store-info] activity log failed', e));
    }

    cache.deletePattern('^settings:')
    const value = setting.value as Record<string, unknown>;
    return apiSuccess({
      ...defaultStoreInfo,
      ...value,
      updatedAt: setting.updatedAt?.toISOString(),
      updatedBySystemId: setting.updatedBy,
      updatedByName: (value as { updatedByName?: string }).updatedByName || null,
    });
  } catch (error) {
    logError('Error updating store info', error);
    return apiError('Failed to update store info', 500);
  }
}
