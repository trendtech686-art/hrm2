/**
 * Enhanced Customer Address Types - REDESIGN
 * 
 * THIẾT KẾ MỚI: 1 Customer có 2 địa chỉ SONG SONG
 * - address2Level: Địa chỉ 2 cấp (Luật 2025 - 34 tỉnh mới)
 * - address3Level: Địa chỉ 3 cấp (Legacy - 63 tỉnh cũ)
 */

export type AddressLevel = '2-level' | '3-level';

/**
 * Địa chỉ 2 cấp (Tỉnh → Phường, KHÔNG có Quận)
 */
export type Address2Level = {
  id: string;
  label: string;
  street: string;
  provinceId: string;
  provinceName: string;
  wardId: string;
  wardName: string;
  // NO districtId
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Địa chỉ 3 cấp (Tỉnh → Quận → Phường)
 */
export type Address3Level = {
  id: string;
  label: string;
  street: string;
  provinceId: string;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardId: string;
  wardName: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Customer có 2 địa chỉ riêng biệt
 */
export type CustomerAddresses = {
  address2Level?: Address2Level;
  address3Level?: Address3Level;
};

/**
 * Input khi tạo địa chỉ 2 cấp
 */
export type CreateAddress2LevelInput = {
  label: string;
  street: string;
  provinceId: string;
  provinceName: string;
  wardId: string;
  wardName: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  isDefault?: boolean;
};

/**
 * Input khi tạo địa chỉ 3 cấp
 */
export type CreateAddress3LevelInput = {
  label: string;
  street: string;
  provinceId: string;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardId: string;
  wardName: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  isDefault?: boolean;
};
