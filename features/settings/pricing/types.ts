export type PricingPolicy = {
  systemId: string;
  id: string; // User-facing code, e.g., "GIANHAP", "BANLE"
  name: string; // e.g., "Giá nhập", "Giá bán lẻ"
  description?: string; // Optional description
  type: 'Nhập hàng' | 'Bán hàng';
  isDefault: boolean;
  isActive: boolean; // Status: Active or Inactive
};

export type BasePricingSetting = {
  systemId: string;
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
};
