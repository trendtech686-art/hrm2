/**
 * Store Info Types
 */

export type StoreGeneralInfoInput = {
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
};

export type StoreGeneralInfo = StoreGeneralInfoInput & {
  updatedAt?: string | undefined;
  updatedBySystemId?: string | undefined;
  updatedByName?: string | undefined;
};

export const defaultStoreInfo: StoreGeneralInfo = {
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
  updatedAt: undefined,
  updatedBySystemId: undefined,
  updatedByName: undefined,
};

export function getDefaultStoreInfo(): StoreGeneralInfo {
  return { ...defaultStoreInfo };
}
