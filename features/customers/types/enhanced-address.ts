/**
 * Enhanced Customer Address Types
 * 
 * Hỗ trợ địa chỉ kép: 2-level (mới) + 3-level (cũ)
 * Tự động điền district khi user chỉ nhập province + ward
 * 
 * Use cases:
 * 1. User nhập 3 cấp → Lưu trực tiếp
 * 2. User nhập 2 cấp → Tự động điền district từ wardId
 * 3. Gửi API vận chuyển → Luôn có đủ 3 cấp
 */

export type AddressLevel = '2-level' | '3-level';

/**
 * Enhanced Customer Address với dual-level support
 */
export type EnhancedCustomerAddress = {
  id: string;
  label: string; // "Văn phòng", "Nhà riêng", "Kho hàng"
  
  // Basic info
  street: string;
  contactName?: string;
  contactPhone?: string;
  
  // Address level tracking
  inputLevel: AddressLevel;        // User chọn nhập 2 cấp hay 3 cấp
  autoFilled: boolean;             // true = district tự động điền, false = user nhập
  convertedAt?: string;            // Timestamp khi chuyển đổi 2→3 (nếu có)
  
  // 2-level address (Địa chỉ mới - theo luật 2025)
  province: string;                // "Thành phố Hà Nội"
  provinceId: string;              // "01" (BNV code)
  ward: string;                    // "Phường Phúc Xá"
  wardId: string;                  // "10101001" (New code)
  
  // 3-level address (Địa chỉ cũ - cho API vận chuyển)
  district: string;                // "Quận Ba Đình"
  districtId: number;              // 10101 (TMS code)
  
  // Flags
  isDefault?: boolean;             // Địa chỉ mặc định chung (deprecated, dùng isDefaultShipping thay thế)
  isShipping?: boolean;            // Sử dụng cho giao hàng (deprecated, dùng isDefaultShipping)
  isBilling?: boolean;             // Sử dụng cho hóa đơn (deprecated, dùng isDefaultBilling)
  isDefaultShipping: boolean;      // Địa chỉ mặc định cho giao hàng
  isDefaultBilling: boolean;       // Địa chỉ mặc định cho hóa đơn
  notes?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Input khi user tạo địa chỉ mới (2-level)
 */
export type CreateAddress2LevelInput = {
  label: string;
  street: string;
  province: string;
  provinceId: string;
  ward: string;
  wardId: string;
  contactName?: string;
  contactPhone?: string;
  isDefault?: boolean;             // Deprecated, dùng isDefaultShipping
  isShipping?: boolean;            // Deprecated, dùng isDefaultShipping
  isBilling?: boolean;             // Deprecated, dùng isDefaultBilling
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  notes?: string;
};

/**
 * Input khi user tạo địa chỉ mới (3-level)
 */
export type CreateAddress3LevelInput = {
  label: string;
  street: string;
  province: string;
  provinceId: string;
  district: string;
  districtId: number;
  ward: string;
  wardId: string;
  contactName?: string;
  contactPhone?: string;
  isDefault?: boolean;             // Deprecated, dùng isDefaultShipping
  isShipping?: boolean;            // Deprecated, dùng isDefaultShipping
  isBilling?: boolean;             // Deprecated, dùng isDefaultBilling
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  notes?: string;
};

/**
 * Kết quả sau khi convert/auto-fill
 */
export type AddressConversionResult = {
  success: boolean;
  address?: EnhancedCustomerAddress;
  address2Level?: EnhancedCustomerAddress; // ← Version 2 cấp (tự động tạo từ 3 cấp)
  error?: string;
};

/**
 * Thống kê địa chỉ khách hàng
 */
export type AddressStatistics = {
  total: number;
  level2: number;           // Số địa chỉ 2 cấp
  level3: number;           // Số địa chỉ 3 cấp
  autoFilled: number;       // Số địa chỉ tự động điền district
  manualConverted: number;  // Số địa chỉ user bấm convert
  needsConversion: number;  // Số địa chỉ cũ cần convert
};
