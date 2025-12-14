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
  fromWardCode?: string | undefined;
  fromAddress?: string | undefined;
  fromProvince?: string | undefined;     // ✅ NEW: Province name for GHTK
  fromDistrict?: string | undefined;     // ✅ NEW: District name for GHTK
  
  // To address (customer)
  toProvinceId: number;
  toDistrictId: number;
  toWardCode?: string | undefined;
  toWard?: string | undefined;           // ✅ NEW: Ward name for 2-level address (GHTK)
  toAddress: string;
  toProvince?: string | undefined;       // ✅ NEW: Province name for GHTK
  toDistrict?: string | undefined;       // ✅ NEW: District name for GHTK
  
  // Package info
  weight: number; // grams
  length?: number | undefined; // cm
  width?: number | undefined; // cm
  height?: number | undefined; // cm
  
  // COD info
  codAmount?: number | undefined;
  insuranceValue?: number | undefined;
  
  // ✅ NEW: Service options for accurate fee calculation
  options?: {
    // GHTK specific
    transport?: 'road' | 'fly' | undefined;
    tags?: number[] | undefined;
    pickWorkShift?: 1 | 2 | undefined;
    deliverWorkShift?: 1 | 2 | undefined;
    orderValue?: number | undefined;
    pickAddressId?: string | undefined; // ✅ Added: Pick address ID for GHTK
    specificAddress?: string | undefined; // ✅ Added: Specific address ID for GHTK
    // Future: Add other partner-specific options here
  } | undefined;
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
  error?: string | undefined;
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
  pickupAddressId: string | undefined;
  deliveryAddress: ShippingAddress | null | undefined;
  
  // Service options (partner-specific)
  options: {
    // Common options
    insurance?: boolean | undefined;
    cod?: number | undefined;
    payer?: 'SHOP' | 'CUSTOMER' | undefined;
    requirement?: string | undefined;
    note?: string | undefined;
    
    // GHN specific
    partialDelivery?: boolean | undefined;
    collectFeedback?: boolean | undefined;
    collectOnFailure?: boolean | undefined;
    pickupMethod?: 'AT_WAREHOUSE' | 'AT_POST_OFFICE' | undefined;
    
    // GHTK specific
    transport?: 'road' | 'fly' | undefined;
    pickWorkShift?: 1 | 2 | undefined; // 1: sáng, 2: chiều
    deliverWorkShift?: 1 | 2 | undefined; // 1: sáng, 2: chiều
    pickOption?: 'cod' | 'post' | undefined; // COD hay gửi tại bưu cục
    pickAddressId?: string | undefined; // ✅ Added: Pick address ID for GHTK
    specificAddress?: string | undefined; // ✅ Added: Specific address ID for GHTK
    pickDate?: string | undefined; // ✅ Added: Pick date
    deliverDate?: string | undefined; // ✅ Added: Deliver date
    
    // Return address override (GHTK)
    useReturnAddress?: 0 | 1 | undefined;
    returnAddress?: string | undefined;
    returnProvince?: string | undefined;
    returnProvinceId?: number | undefined; // ✅ Added: Return province ID
    returnDistrict?: string | undefined;
    returnDistrictId?: number | undefined; // ✅ Added: Return district ID
    returnWard?: string | undefined;
    returnWardId?: string | undefined; // ✅ Added: Return ward ID (often string code)
    returnName?: string | undefined;
    returnTel?: string | undefined;

    orderValue?: number | undefined; // Giá trị hàng hoá (để khai giá)
    totalBox?: number | undefined; // Tổng số kiện hàng
    tags?: number[] | undefined; // Tags: 1,2,6,7,8,10,13,17,18,19,62
    subTags?: number[] | undefined; // Sub tags cho cây cối: 1-5
    failedDeliveryFee?: number | undefined; // ✅ Số tiền thu khi không giao được (tag 19) - Giới hạn: 10k-20tr
    transportType?: 'road' | 'fly' | undefined; // Legacy field, use transport instead
    ghtkTags?: number[] | undefined; // Legacy field, use tags instead
    expectedDelivery?: string | undefined;
    schedulePickup?: string | undefined;
    pickupAtPostOffice?: boolean | undefined;
    inspection?: boolean | undefined;
    intactPackage?: boolean | undefined;
    partialReturn?: boolean | undefined;
    cancelFee?: boolean | undefined;
    freshFood?: boolean | undefined;
    highValueRequirement?: boolean | undefined;
    fragileItem?: boolean | undefined;
    bulkyItem?: boolean | undefined;
    callOnIssue?: boolean | undefined;
    noXRay?: boolean | undefined;
    
    // VTP specific
    deliverAtBranch?: boolean | undefined;
    highValue?: boolean | undefined;
    coldChain?: boolean | undefined;
    returnOutbound?: boolean | undefined;
    returnInbound?: boolean | undefined;
    returnBothWays?: boolean | undefined;
    deliverInPerson?: boolean | undefined;
    tryBeforeBuy?: boolean | undefined;
    
    // J&T specific
    // (uses common options above)
    
    // SPX specific
    rejectFee?: boolean | undefined;
  } | undefined;
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
