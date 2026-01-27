/**
 * Store Info Settings API
 * GET /api/settings/store-info - Fetch store info
 * PUT /api/settings/store-info - Update store info
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils';

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
    console.error('Error fetching store info:', error);
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
        key: STORE_INFO_KEY,
        group: STORE_INFO_GROUP,
        type: 'json',
        category: 'store',
        description: 'Thông tin cửa hàng',
        value: { ...storeInfoData, updatedByName },
        updatedBy: updatedBySystemId || session.user?.id,
      },
    });

    const value = setting.value as Record<string, unknown>;
    return apiSuccess({
      ...defaultStoreInfo,
      ...value,
      updatedAt: setting.updatedAt?.toISOString(),
      updatedBySystemId: setting.updatedBy,
      updatedByName: (value as { updatedByName?: string }).updatedByName || null,
    });
  } catch (error) {
    console.error('Error updating store info:', error);
    return apiError('Failed to update store info', 500);
  }
}
