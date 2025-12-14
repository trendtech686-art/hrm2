import type { BusinessId, SystemId } from '@/lib/id-types';

export interface Tax {
  systemId: SystemId;
  id: BusinessId; // Mã thuế (user-defined)
  name: string; // Tên thuế
  rate: number; // Thuế suất (%)
  isDefaultSale: boolean; // Mặc định cho bán hàng
  isDefaultPurchase: boolean; // Mặc định cho nhập hàng
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
}

export type TaxFormValues = Omit<Tax, 'systemId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
