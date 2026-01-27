/**
 * Store Info Reset API
 * POST /api/settings/store-info/reset - Reset store info to defaults
 */

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

export async function POST() {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    // Delete the existing setting
    await prisma.setting.deleteMany({
      where: {
        key: STORE_INFO_KEY,
        group: STORE_INFO_GROUP,
      },
    });

    return apiSuccess({
      ...defaultStoreInfo,
      updatedAt: null,
      updatedBySystemId: null,
      updatedByName: null,
    });
  } catch (error) {
    console.error('Error resetting store info:', error);
    return apiError('Failed to reset store info', 500);
  }
}
