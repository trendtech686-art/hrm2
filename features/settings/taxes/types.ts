import type { BusinessId, SystemId } from '@/lib/id-types';

export type TaxType = 'purchase' | 'sale'; // Thuế nhập hàng | Thuế bán hàng

export interface Tax {
  systemId: SystemId;
  id: BusinessId; // Mã thuế (user-defined)
  name: string; // Tên thuế
  rate: number; // Thuế suất (%)
  type: TaxType; // Loại thuế
  isDefault: boolean; // Mặc định cho loại này
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaxFormValues = Omit<Tax, 'systemId' | 'createdAt' | 'updatedAt'>;
