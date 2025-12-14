import type { BusinessId, SystemId } from '@/lib/id-types';

export type PricingPolicy = {
  systemId: SystemId;
  id: BusinessId; // User-facing code, e.g., "GIANHAP", "BANLE"
  name: string; // e.g., "Giá nhập", "Giá bán lẻ"
  description?: string | undefined; // Optional description
  type: 'Nhập hàng' | 'Bán hàng';
  isDefault: boolean;
  isActive: boolean; // Status: Active or Inactive
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export type BasePricingSetting = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string | undefined;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
