'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

/**
 * Store Info Server Actions
 * Uses SettingsData model with type = 'store-info' (single record)
 */

type _SettingsData = NonNullable<Awaited<ReturnType<typeof prisma.settingsData.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface StoreInfo {
  companyName: string;
  brandName: string;
  logo?: string;
  taxCode: string;
  registrationNumber: string;
  representativeName: string;
  representativeTitle: string;
  hotline: string;
  email: string;
  website: string;
  headquartersAddress: string;
  ward: string;
  district: string;
  province: string;
  note: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  updatedAt?: string;
  updatedBySystemId?: string;
  updatedByName?: string;
}

const SETTINGS_TYPE = 'store-info';
const SETTINGS_ID = 'STORE-INFO';

export async function getStoreInfo(): Promise<ActionResult<StoreInfo>> {
  try {
    const record = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE, id: SETTINGS_ID },
    });

    if (!record) {
      // Return default store info
      return {
        success: true,
        data: getDefaultStoreInfo(),
      };
    }

    const metadata = (record.metadata as Record<string, unknown>) || {};
    
    return {
      success: true,
      data: {
        companyName: (metadata.companyName as string) || '',
        brandName: (metadata.brandName as string) || '',
        logo: (metadata.logo as string) || '',
        taxCode: (metadata.taxCode as string) || '',
        registrationNumber: (metadata.registrationNumber as string) || '',
        representativeName: (metadata.representativeName as string) || '',
        representativeTitle: (metadata.representativeTitle as string) || '',
        hotline: (metadata.hotline as string) || '',
        email: (metadata.email as string) || '',
        website: (metadata.website as string) || '',
        headquartersAddress: (metadata.headquartersAddress as string) || '',
        ward: (metadata.ward as string) || '',
        district: (metadata.district as string) || '',
        province: (metadata.province as string) || '',
        note: (metadata.note as string) || '',
        bankAccountName: (metadata.bankAccountName as string) || '',
        bankAccountNumber: (metadata.bankAccountNumber as string) || '',
        bankName: (metadata.bankName as string) || '',
        updatedAt: record.updatedAt?.toISOString(),
        updatedBySystemId: (metadata.updatedBySystemId as string) || undefined,
        updatedByName: (metadata.updatedByName as string) || undefined,
      },
    };
  } catch (error) {
    console.error('Failed to fetch store info:', error);
    return { success: false, error: 'Không thể tải thông tin cửa hàng' };
  }
}

export async function updateStoreInfo(
  data: Partial<StoreInfo>
): Promise<ActionResult<StoreInfo>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE, id: SETTINGS_ID },
    });

    const metadata = {
      ...(existing?.metadata as Record<string, unknown> || {}),
      ...data,
    };

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: {
          name: data.companyName || 'Store Info',
          metadata,
          updatedBy: data.updatedBySystemId,
        },
      });
    } else {
      await prisma.settingsData.create({
        data: {
          systemId: await generateIdWithPrefix('STORE', prisma),
          id: SETTINGS_ID,
          name: data.companyName || 'Store Info',
          type: SETTINGS_TYPE,
          metadata,
          isActive: true,
          createdBy: data.updatedBySystemId,
        },
      });
    }

    const result = await getStoreInfo();
    
    revalidatePath('/settings/store-info');
    return result;
  } catch (error) {
    console.error('Failed to update store info:', error);
    return { success: false, error: 'Không thể cập nhật thông tin cửa hàng' };
  }
}

export async function resetStoreInfo(): Promise<ActionResult<StoreInfo>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE, id: SETTINGS_ID },
    });

    if (existing) {
      await prisma.settingsData.delete({
        where: { systemId: existing.systemId },
      });
    }

    revalidatePath('/settings/store-info');
    return { success: true, data: getDefaultStoreInfo() };
  } catch (error) {
    console.error('Failed to reset store info:', error);
    return { success: false, error: 'Không thể đặt lại thông tin cửa hàng' };
  }
}

function getDefaultStoreInfo(): StoreInfo {
  return {
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
}
