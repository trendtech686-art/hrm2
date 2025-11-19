/**
 * Order Form Address Integration
 * 
 * Tích hợp Enhanced Address vào Order Form
 * Tự động chuyển đổi sang format cho Shipping API
 */

import { useEffect, useState } from 'react';
import type { EnhancedCustomerAddress } from '@/features/customers/types/enhanced-address';
import type { ShippingAddress } from '@/features/orders/components/shipping/types';
import { toShippingApiFormat } from '@/features/customers/utils/enhanced-address-helper';
import { useProvinceStore } from '@/features/settings/provinces/store';

/**
 * Hook: Chuyển đổi EnhancedCustomerAddress sang ShippingAddress
 */
export function useEnhancedAddressForShipping(
  customerAddress: EnhancedCustomerAddress | null
): {
  shippingAddress: ShippingAddress | null;
  provinceData: any;
  wardData: any;
  districtData: any;
  isReady: boolean;
} {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [provinceData, setProvinceData] = useState<any>(null);
  const [wardData, setWardData] = useState<any>(null);
  const [districtData, setDistrictData] = useState<any>(null);

  const { data: provinces, getDistrictById } = useProvinceStore();

  useEffect(() => {
    if (!customerAddress) {
      setShippingAddress(null);
      setProvinceData(null);
      setWardData(null);
      setDistrictData(null);
      return;
    }

    // Convert to Shipping API format
    const apiFormat = toShippingApiFormat(customerAddress);

    // Create ShippingAddress
    const shipping: ShippingAddress = {
      name: customerAddress.contactName || '',
      phone: customerAddress.contactPhone || '',
      address: customerAddress.street,
      province: customerAddress.province,
      provinceId: apiFormat.provinceId,
      district: customerAddress.district,
      districtId: customerAddress.districtId,
      ward: customerAddress.ward,
      wardCode: customerAddress.wardId,
    };

    setShippingAddress(shipping);

    // Load related data for components
    const province = provinces.find(p => p.id === customerAddress.provinceId);
    const district = getDistrictById(customerAddress.districtId);

    setProvinceData(province || null);
    setDistrictData(district || null);
    setWardData({
      id: customerAddress.wardId,
      name: customerAddress.ward,
      provinceId: customerAddress.provinceId,
      districtId: customerAddress.districtId,
    });
  }, [customerAddress, provinces, getDistrictById]);

  return {
    shippingAddress,
    provinceData,
    wardData,
    districtData,
    isReady: !!shippingAddress,
  };
}

/**
 * Helper: Tạo ShippingAddress từ Customer data cũ (legacy)
 */
export function convertLegacyCustomerAddressToShipping(customer: {
  shippingAddress_street?: string;
  shippingAddress_ward?: string;
  shippingAddress_province?: string;
  phone?: string;
  name?: string;
}): ShippingAddress | null {
  if (!customer.shippingAddress_street || !customer.shippingAddress_province) {
    return null;
  }

  // Legacy data không có district - cần user cập nhật
  return {
    name: customer.name || '',
    phone: customer.phone || '',
    address: customer.shippingAddress_street,
    province: customer.shippingAddress_province,
    provinceId: 0, // Unknown
    district: '',  // Unknown - cần cập nhật
    districtId: 0, // Unknown - cần cập nhật
    ward: customer.shippingAddress_ward || '',
    wardCode: '',  // Unknown
  };
}

/**
 * Validate xem địa chỉ có đủ thông tin cho Shipping API không
 */
export function isAddressReadyForShipping(address: ShippingAddress | null): {
  ready: boolean;
  missingFields: string[];
} {
  if (!address) {
    return {
      ready: false,
      missingFields: ['Chưa có địa chỉ'],
    };
  }

  const missing: string[] = [];

  if (!address.address) missing.push('Địa chỉ đường phố');
  if (!address.province) missing.push('Tỉnh/Thành phố');
  if (!address.district) missing.push('Quận/Huyện');
  if (!address.ward) missing.push('Phường/Xã');
  if (!address.provinceId || address.provinceId === 0) missing.push('Mã tỉnh');
  if (!address.districtId || address.districtId === 0) missing.push('Mã quận/huyện');

  return {
    ready: missing.length === 0,
    missingFields: missing,
  };
}
