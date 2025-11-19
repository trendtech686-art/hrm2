import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StoreGeneralInfoInput = {
  companyName: string;
  brandName: string;
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
};

export type StoreGeneralInfo = StoreGeneralInfoInput & {
  updatedAt?: string;
  updatedBySystemId?: string;
  updatedByName?: string;
};

interface StoreInfoState {
  info: StoreGeneralInfo;
  updateInfo: (
    values: StoreGeneralInfoInput,
    metadata?: { updatedBySystemId?: string; updatedByName?: string }
  ) => void;
  reset: () => void;
}

const defaultInfo: StoreGeneralInfo = {
  companyName: '',
  brandName: '',
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
  updatedAt: undefined,
  updatedBySystemId: undefined,
  updatedByName: undefined,
};

export const useStoreInfoStore = create<StoreInfoState>()(
  persist(
    (set) => ({
      info: { ...defaultInfo },
      updateInfo: (values, metadata) =>
        set(() => ({
          info: {
            ...values,
            updatedAt: new Date().toISOString(),
            updatedBySystemId: metadata?.updatedBySystemId,
            updatedByName: metadata?.updatedByName,
          },
        })),
      reset: () => set(() => ({ info: { ...defaultInfo } })),
    }),
    {
      name: 'store-info-settings',
    }
  )
);

export function getDefaultStoreInfo(): StoreGeneralInfo {
  return { ...defaultInfo };
}
