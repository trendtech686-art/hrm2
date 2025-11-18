/**
 * Shipping Integration Types
 * For real-time shipping partner integration
 */

import type { PartnerAccount } from '@/lib/types/shipping-config';

/**
 * Delivery method options
 */
export type DeliveryMethod = 
  | 'shipping-partner'  // Đẩy qua hãng vận chuyển
  | 'external'          // Đẩy vận chuyển ngoài
  | 'pickup'            // Khách nhận tại cửa hàng
  | 'deliver-later';    // Giao hàng sau

/**
 * Shipping service from partner API
 */
export interface ShippingService {
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  accountSystemId: string;
  serviceId: string;
  serviceName: string;
  fee: number;
  estimatedDays: string;
  expectedDeliveryDate?: string;
  note?: string;
}

/**
 * Shipping calculation request
 */
export interface ShippingCalculationRequest {
  // From address (pickup)
  fromProvinceId: number;
  fromDistrictId: number;
  fromWardCode?: string;
  fromAddress?: string;
  fromProvince?: string;     // ✅ NEW: Province name for GHTK
  fromDistrict?: string;     // ✅ NEW: District name for GHTK
  
  // To address (customer)
  toProvinceId: number;
  toDistrictId: number;
  toWardCode?: string;
  toWard?: string;           // ✅ NEW: Ward name for 2-level address (GHTK)
  toAddress: string;
  toProvince?: string;       // ✅ NEW: Province name for GHTK
  toDistrict?: string;       // ✅ NEW: District name for GHTK
  
  // Package info
  weight: number; // grams
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
  
  // COD info
  codAmount?: number;
  insuranceValue?: number;
  
  // ✅ NEW: Service options for accurate fee calculation
  options?: {
    // GHTK specific
    transport?: 'road' | 'fly';
    tags?: number[];
    pickWorkShift?: 1 | 2;
    deliverWorkShift?: 1 | 2;
    orderValue?: number;
    pickAddressId?: string; // ✅ Added: Pick address ID for GHTK
    // Future: Add other partner-specific options here
  };
}

/**
 * Shipping calculation result per partner
 */
export interface ShippingCalculationResult {
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  accountSystemId: string;
  status: 'loading' | 'success' | 'error';
  services: ShippingService[];
  error?: string;
}

/**
 * Selected shipping configuration
 */
export interface SelectedShippingConfig {
  // Selected service
  service: ShippingService;
  
  // Package details
  weight: number; // grams
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  
  // Pickup & Delivery
  pickupAddressId: string;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    provinceId: number;
    districtId: number;
    wardCode?: string;
  };
  
  // Service options (partner-specific)
  options: {
    // Common options
    insurance?: boolean;
    cod?: number;
    payer?: 'SHOP' | 'CUSTOMER';
    requirement?: string;
    note?: string;
    
    // GHN specific
    partialDelivery?: boolean;
    collectFeedback?: boolean;
    collectOnFailure?: boolean;
    pickupMethod?: 'AT_WAREHOUSE' | 'AT_POST_OFFICE';
    
    // GHTK specific
    pickAddressId?: string; // ID địa chỉ lấy hàng (từ API list_pick_add)
    specificAddress?: string; // ID địa chỉ chi tiết (từ API getAddressLevel4)
    useReturnAddress?: 0 | 1; // 0: trả về địa chỉ lấy hàng, 1: trả về địa chỉ khác
    returnName?: string;
    returnAddress?: string;
    returnProvince?: string;
    returnProvinceId?: string; // ✅ ID for combobox
    returnDistrict?: string;
    returnDistrictId?: number; // ✅ ID for combobox
    returnWard?: string;
    returnWardId?: string; // ✅ ID for combobox
    returnStreet?: string;
    returnTel?: string;
    returnEmail?: string;
    transport?: 'road' | 'fly'; // Đường bộ hoặc bay
    pickDate?: string; // YYYY-MM-DD
    deliverDate?: string; // YYYY-MM-DD
    pickWorkShift?: 1 | 2; // 1: sáng, 2: chiều
    deliverWorkShift?: 1 | 2; // 1: sáng, 2: chiều
    pickOption?: 'cod' | 'post'; // COD hay gửi tại bưu cục
    orderValue?: number; // Giá trị hàng hoá (để khai giá)
    totalBox?: number; // Tổng số kiện hàng
    tags?: number[]; // Tags: 1,2,6,7,8,10,13,17,18,19,62
    subTags?: number[]; // Sub tags cho cây cối: 1-5
    failedDeliveryFee?: number; // ✅ Số tiền thu khi không giao được (tag 19) - Giới hạn: 10k-20tr
    transportType?: 'road' | 'fly'; // Legacy field, use transport instead
    ghtkTags?: number[]; // Legacy field, use tags instead
    expectedDelivery?: string;
    schedulePickup?: string;
    pickupAtPostOffice?: boolean;
    inspection?: boolean;
    intactPackage?: boolean;
    partialReturn?: boolean;
    cancelFee?: boolean;
    freshFood?: boolean;
    highValueRequirement?: boolean;
    fragileItem?: boolean;
    bulkyItem?: boolean;
    callOnIssue?: boolean;
    noXRay?: boolean;
    
    // VTP specific
    deliverAtBranch?: boolean;
    highValue?: boolean;
    coldChain?: boolean;
    returnOutbound?: boolean;
    returnInbound?: boolean;
    returnBothWays?: boolean;
    deliverInPerson?: boolean;
    tryBeforeBuy?: boolean;
    
    // J&T specific
    // (uses common options above)
    
    // SPX specific
    rejectFee?: boolean;
  };
}

/**
 * Address info for shipping
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  province: string;
  provinceId: number;
  district: string;
  districtId: number;
  ward?: string;
  wardCode?: string;
}

/**
 * Package info for shipping
 */
export interface PackageInfo {
  weight: number; // Khối lượng
  weightUnit?: 'gram' | 'kilogram'; // Đơn vị khối lượng
  length: number; // cm
  width: number; // cm
  height: number; // cm
  codAmount: number;
  insuranceValue?: number;
}

/**
 * Shipping fee calculation cache key
 */
export interface ShippingCacheKey {
  fromDistrictId: number;
  toDistrictId: number;
  weight: number;
  codAmount: number;
}
