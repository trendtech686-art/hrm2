import type { BusinessId, SystemId } from '@/lib/id-types';

export type PricingPolicy = {
  systemId: SystemId;
  id: BusinessId; // User-facing code, e.g., "GIANHAP", "BANLE"
  name: string; // e.g., "Giá nhập", "Giá bán lẻ"
  description?: string; // Optional description
  type: 'Nhập hàng' | 'Bán hàng';
  isDefault: boolean;
  isActive: boolean; // Status: Active or Inactive
};

export type BasePricingSetting = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
  isActive: boolean;
};
