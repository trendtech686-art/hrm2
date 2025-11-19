/**
 * Enhanced Address Helper
 * 
 * Xử lý logic tự động điền district cho địa chỉ khách hàng
 * Hỗ trợ gửi API vận chuyển với địa chỉ đầy đủ 3 cấp
 */

import { nanoid } from 'nanoid';
import type {
  EnhancedCustomerAddress,
  CreateAddress2LevelInput,
  CreateAddress3LevelInput,
  AddressConversionResult,
  AddressLevel,
} from '../types/enhanced-address';
import { getDistrictByWardId, autoFillDistrict } from '@/features/settings/provinces/ward-district-mapping';

/**
 * Tạo địa chỉ mới từ input 2-level (tự động điền district)
 * 
 * @example
 * const address = createAddress2Level({
 *   label: "Nhà riêng",
 *   street: "123 Nguyễn Trãi",
 *   provinceId: "01",
 *   provinceName: "Hà Nội",
 *   wardId: "10101001",
 *   wardName: "Phường Phúc Xá"
 * });
 * // Returns: EnhancedCustomerAddress với district tự động điền
 */
export function createAddress2Level(
  input: CreateAddress2LevelInput
): AddressConversionResult {
  try {
    // Tự động điền district từ wardId
    const filled = autoFillDistrict({
      provinceId: input.provinceId,
      provinceName: input.province,
      wardId: input.wardId,
      wardName: input.ward,
    });

    const address: EnhancedCustomerAddress = {
      id: nanoid(),
      label: input.label,
      street: input.street,
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      
      // Tracking
      inputLevel: '2-level',
      autoFilled: true,     // District được tự động điền
      
      // 2-level
      province: filled.provinceName,
      provinceId: filled.provinceId,
      ward: filled.wardName,
      wardId: filled.wardId,
      
      // 3-level (auto-filled)
      district: filled.districtName,
      districtId: filled.districtId,
      
      // Flags
      isDefault: input.isDefault ?? false,
      isShipping: input.isShipping ?? true,
      isBilling: input.isBilling ?? false,
      isDefaultShipping: input.isShipping ?? input.isDefault ?? true,  // Map isShipping hoặc isDefault
      isDefaultBilling: input.isBilling ?? false,                      // Map isBilling
      notes: input.notes,
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      address,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Tạo địa chỉ mới từ input 3-level (user nhập đầy đủ)
 * 
 * ✅ NEW: Tự động tạo version 2 cấp (bỏ district) để gửi cho GHN/GHTK
 */
export function createAddress3Level(
  input: CreateAddress3LevelInput
): AddressConversionResult {
  try {
    // Validate: ward có thuộc district không?
    const mapping = getDistrictByWardId(input.wardId);
    if (mapping && mapping.districtId !== input.districtId) {
      throw new Error(
        `Phường/xã "${input.ward}" không thuộc quận/huyện "${input.district}"`
      );
    }

    const address: EnhancedCustomerAddress = {
      id: nanoid(),
      label: input.label,
      street: input.street,
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      
      // Tracking
      inputLevel: '3-level',
      autoFilled: false,    // User nhập đầy đủ
      
      // 2-level
      province: input.province,
      provinceId: input.provinceId,
      ward: input.ward,
      wardId: input.wardId,
      
      // 3-level
      district: input.district,
      districtId: input.districtId,
      
      // Flags
      isDefault: input.isDefault ?? false,
      isShipping: input.isShipping ?? true,
      isBilling: input.isBilling ?? false,
      isDefaultShipping: input.isShipping ?? input.isDefault ?? true,  // Map isShipping hoặc isDefault
      isDefaultBilling: input.isBilling ?? false,                      // Map isBilling
      notes: input.notes,
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ✅ NEW: Tự động tạo version 2 cấp (bỏ district)
    // Dùng cho API GHN/GHTK nếu cần
    const address2Level = {
      ...address,
      id: `${address.id}_2LEVEL`, // ID riêng cho version 2 cấp
      inputLevel: '2-level' as AddressLevel,
      district: '',
      districtId: 0,
      notes: `[Auto-generated from 3-level] ${input.notes || ''}`.trim(),
    };

    return {
      success: true,
      address,
      address2Level, // ← Version 2 cấp tự động tạo
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Chuyển đổi địa chỉ cũ (chỉ có 2-level) sang format mới
 * Dùng cho dữ liệu legacy
 * 
 * @example
 * const oldAddress = {
 *   street: "123 ABC",
 *   ward: "Phường Phúc Xá",
 *   province: "Hà Nội"
 * };
 * const converted = convertLegacyAddress(oldAddress, "01", "10101001");
 */
export function convertLegacyAddress(
  oldAddress: {
    label?: string;
    street: string;
    ward?: string;
    district?: string;
    province?: string;
    contactName?: string;
    contactPhone?: string;
    isDefault?: boolean;
    isShipping?: boolean;
    isBilling?: boolean;
    notes?: string;
  },
  provinceId: string,
  wardId: string
): AddressConversionResult {
  try {
    if (!oldAddress.province || !oldAddress.ward) {
      throw new Error('Địa chỉ cũ thiếu thông tin tỉnh/phường');
    }

    // Tự động điền district
    const filled = autoFillDistrict({
      provinceId,
      provinceName: oldAddress.province,
      wardId,
      wardName: oldAddress.ward,
    });

    const address: EnhancedCustomerAddress = {
      id: nanoid(),
      label: oldAddress.label || 'Địa chỉ chính',
      street: oldAddress.street,
      contactName: oldAddress.contactName,
      contactPhone: oldAddress.contactPhone,
      
      // Tracking
      inputLevel: '2-level',
      autoFilled: true,
      convertedAt: new Date().toISOString(), // Đánh dấu được convert
      
      // 2-level
      province: filled.provinceName,
      provinceId: filled.provinceId,
      ward: filled.wardName,
      wardId: filled.wardId,
      
      // 3-level (auto-filled)
      district: filled.districtName,
      districtId: filled.districtId,
      
      // Flags
      isDefault: oldAddress.isDefault ?? true,
      isShipping: oldAddress.isShipping ?? true,
      isBilling: oldAddress.isBilling ?? false,
      isDefaultShipping: oldAddress.isShipping ?? oldAddress.isDefault ?? true,  // Map isShipping hoặc isDefault
      isDefaultBilling: oldAddress.isBilling ?? false,                          // Map isBilling
      notes: oldAddress.notes,
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      address,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Format địa chỉ để hiển thị (2-level)
 */
export function formatAddress2Level(address: EnhancedCustomerAddress): string {
  return `${address.street}, ${address.ward}, ${address.province}`;
}

/**
 * Format địa chỉ để hiển thị (3-level)
 */
export function formatAddress3Level(address: EnhancedCustomerAddress): string {
  return `${address.street}, ${address.ward}, ${address.district}, ${address.province}`;
}

/**
 * Chuyển địa chỉ sang format cho API vận chuyển
 * Luôn trả về 3-level đầy đủ
 */
export function toShippingApiFormat(address: EnhancedCustomerAddress) {
  return {
    // For display
    address: address.street,
    ward: address.ward,
    district: address.district,
    province: address.province,
    
    // For API
    provinceId: parseInt(address.provinceId, 10),
    districtId: address.districtId,
    wardCode: address.wardId,
    
    // Contact
    name: address.contactName,
    phone: address.contactPhone,
  };
}

/**
 * Validate địa chỉ trước khi gửi API vận chuyển
 */
export function validateShippingAddress(
  address: EnhancedCustomerAddress
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!address.street) errors.push('Thiếu địa chỉ đường phố');
  if (!address.province) errors.push('Thiếu tỉnh/thành phố');
  if (!address.district) errors.push('Thiếu quận/huyện');
  if (!address.ward) errors.push('Thiếu phường/xã');
  if (!address.provinceId) errors.push('Thiếu mã tỉnh');
  if (!address.districtId) errors.push('Thiếu mã quận/huyện');
  if (!address.wardId) errors.push('Thiếu mã phường/xã');

  return {
    valid: errors.length === 0,
    errors,
  };
}
