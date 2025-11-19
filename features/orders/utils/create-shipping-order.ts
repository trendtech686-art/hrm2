/**
 * Shipping Order Creation Helper
 * Handles API calls to create shipping orders with different partners
 * 
 * Uses simple 2-to-3 level mapping: districtId = provinceId
 * This works because Vietnam's 2025 administrative reform removed the district level,
 * but shipping APIs still require 3-level structure.
 * 
 * STATUS: Phase 6 - READY FOR IMPLEMENTATION
 * This file contains the complete structure and mapping logic.
 * Next step: Integrate with actual API service instances from shipping config.
 */

import type {
  ShippingService,
  SelectedShippingConfig,
  ShippingAddress,
  PackageInfo,
} from '../components/shipping/types';
import type { Province, Ward } from '@/features/settings/provinces/types';
import { mapTo3Level, validateAddress } from './address-level-mapper';

export type CreateShippingOrderParams = {
  selectedService: ShippingService;
  config: SelectedShippingConfig;
  pickupAddress: ShippingAddress;
  deliveryAddress: ShippingAddress;
  packageInfo: PackageInfo;
  orderId: string; // Your internal order ID
  
  // Province/Ward objects for mapping
  pickupProvince: Province;
  pickupWard: Ward;
  deliveryProvince: Province;
  deliveryWard: Ward;
};

export type CreateShippingOrderResult = {
  success: boolean;
  trackingCode?: string;
  orderCode?: string;
  error?: string;
  data?: any;
};

/**
 * Validates shipping data before creating order
 */
export function validateShippingData(
  params: CreateShippingOrderParams
): { valid: boolean; error?: string } {
  const { selectedService, pickupAddress, deliveryAddress, packageInfo, pickupProvince, pickupWard, deliveryProvince, deliveryWard } = params;

  // Validate selected service
  if (!selectedService) {
    return { valid: false, error: 'Chưa chọn đơn vị vận chuyển' };
  }

  // Validate addresses
  if (!pickupAddress || !deliveryAddress) {
    return { valid: false, error: 'Thiếu thông tin địa chỉ' };
  }

  // Validate pickup address compatibility
  const pickupValidation = validateAddress(pickupProvince, pickupWard);
  if (!pickupValidation.valid) {
    return { valid: false, error: `Địa chỉ lấy hàng: ${pickupValidation.error}` };
  }

  // Validate delivery address compatibility
  const deliveryValidation = validateAddress(deliveryProvince, deliveryWard);
  if (!deliveryValidation.valid) {
    return { valid: false, error: `Địa chỉ giao hàng: ${deliveryValidation.error}` };
  }

  // Validate package info
  if (!packageInfo.weight || packageInfo.weight <= 0) {
    return { valid: false, error: 'Trọng lượng phải lớn hơn 0' };
  }

  return { valid: true };
}

/**
 * Creates shipping order with GHN
 * TODO: Integrate with GHNService class and shipping config
 */
async function createGHNOrder(
  params: CreateShippingOrderParams
): Promise<CreateShippingOrderResult> {
  try {
    const { config, pickupAddress, deliveryAddress, packageInfo, orderId, pickupProvince, pickupWard, deliveryProvince, deliveryWard } = params;

    // Map 2-level addresses to 3-level format
    const pickup3Level = mapTo3Level(pickupProvince, pickupWard);
    const delivery3Level = mapTo3Level(deliveryProvince, deliveryWard);

    console.log('GHN Order Data Structure:', {
      payment_type_id: config.options.payer === 'SHOP' ? 1 : 2,
      required_note: config.options.requirement || 'KHONGCHOXEMHANG',
      from_name: pickupAddress.name,
      from_phone: pickupAddress.phone,
      from_address: pickupAddress.address,
      from_ward_code: pickup3Level.wardCode,
      from_district_id: pickup3Level.districtId, // Mapped from provinceId
      from_province_id: pickup3Level.provinceId,
      
      to_name: deliveryAddress.name,
      to_phone: deliveryAddress.phone,
      to_address: deliveryAddress.address,
      to_ward_code: delivery3Level.wardCode,
      to_district_id: delivery3Level.districtId, // Mapped from provinceId
      
      weight: packageInfo.weight,
      length: packageInfo.length || 1,
      width: packageInfo.width || 1,
      height: packageInfo.height || 1,
      
      service_id: parseInt(config.service.serviceId, 10),
      cod_amount: packageInfo.codAmount || 0,
      insurance_value: config.options.insurance ? (packageInfo.insuranceValue || packageInfo.codAmount) : 0,
      
      client_order_code: orderId,
      note: config.options.note,
    });

    // TODO: Implement actual API call
    // const ghnService = new GHNService(credentials);
    // const response = await ghnService.createOrder(orderData);
    
    return {
      success: false,
      error: 'GHN createOrder - Chưa kết nối với API (cần credentials từ shipping config)',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Lỗi khi tạo đơn GHN',
    };
  }
}

/**
 * Creates shipping order with GHTK
 * TODO: Integrate with GHTKService class and shipping config
 */
async function createGHTKOrder(
  params: CreateShippingOrderParams
): Promise<CreateShippingOrderResult> {
  try {
    const { config, pickupAddress, deliveryAddress, packageInfo, orderId, pickupProvince, pickupWard, deliveryProvince, deliveryWard } = params;

    // Map 2-level addresses to 3-level format
    const pickup3Level = mapTo3Level(pickupProvince, pickupWard);
    const delivery3Level = mapTo3Level(deliveryProvince, deliveryWard);

    console.log('GHTK Order Data Structure:', {
      products: [
        {
          name: 'Đơn hàng',
          weight: packageInfo.weight / 1000, // Convert to kg
          quantity: 1,
        },
      ],
      order: {
        id: orderId,
        pick_name: pickupAddress.name,
        pick_tel: pickupAddress.phone,
        pick_address: pickupAddress.address,
        pick_province: pickup3Level.provinceName,
        pick_district: pickup3Level.districtName, // Mapped from province name
        pick_ward: pickup3Level.wardName,
        
        name: deliveryAddress.name,
        tel: deliveryAddress.phone,
        address: deliveryAddress.address,
        province: delivery3Level.provinceName,
        district: delivery3Level.districtName, // Mapped from province name
        ward: delivery3Level.wardName,
        
        is_freeship: config.options.payer === 'SHOP' ? 1 : 0,
        pick_money: packageInfo.codAmount || 0,
        note: config.options.note,
        
        value: packageInfo.codAmount || 0,
        transport: config.options.transportType?.toLowerCase() || 'road',
      },
    });

    // TODO: Implement actual API call
    // const ghtkService = new GHTKService(credentials);
    // const response = await ghtkService.createOrder(orderData);
    
    return {
      success: false,
      error: 'GHTK createOrder - Chưa kết nối với API (cần credentials từ shipping config)',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Lỗi khi tạo đơn GHTK',
    };
  }
}

/**
 * Creates shipping order with VTP
 * TODO: Integrate with VTPService class and shipping config
 */
async function createVTPOrder(
  params: CreateShippingOrderParams
): Promise<CreateShippingOrderResult> {
  try {
    const { config, pickupAddress, deliveryAddress, packageInfo, orderId, pickupProvince, pickupWard, deliveryProvince, deliveryWard } = params;

    // Map 2-level addresses to 3-level format
    const pickup3Level = mapTo3Level(pickupProvince, pickupWard);
    const delivery3Level = mapTo3Level(deliveryProvince, deliveryWard);

    console.log('VTP Order Data Structure:', {
      ORDER_NUMBER: orderId,
      
      SENDER_FULLNAME: pickupAddress.name,
      SENDER_PHONE: pickupAddress.phone,
      SENDER_ADDRESS: pickupAddress.address,
      SENDER_PROVINCE: pickup3Level.provinceId,
      SENDER_DISTRICT: pickup3Level.districtId, // Mapped from provinceId
      SENDER_WARDS: parseInt(pickup3Level.wardCode, 10),
      
      RECEIVER_FULLNAME: deliveryAddress.name,
      RECEIVER_PHONE: deliveryAddress.phone,
      RECEIVER_ADDRESS: deliveryAddress.address,
      RECEIVER_PROVINCE: delivery3Level.provinceId,
      RECEIVER_DISTRICT: delivery3Level.districtId, // Mapped from provinceId
      RECEIVER_WARDS: parseInt(delivery3Level.wardCode, 10),
      
      PRODUCT_WEIGHT: packageInfo.weight,
      PRODUCT_LENGTH: packageInfo.length || 1,
      PRODUCT_WIDTH: packageInfo.width || 1,
      PRODUCT_HEIGHT: packageInfo.height || 1,
      
      MONEY_COLLECTION: packageInfo.codAmount || 0,
      PRODUCT_PRICE: packageInfo.codAmount || 0,
      
      ORDER_SERVICE: config.service.serviceId || 'VCN',
      ORDER_PAYMENT: config.options.payer === 'SHOP' ? 1 : 2,
      
      ORDER_NOTE: config.options.note,
    });

    // TODO: Implement actual API call
    // const vtpService = new VTPService(credentials);
    // const response = await vtpService.createOrder(orderData);
    
    return {
      success: false,
      error: 'VTP createOrder - Chưa kết nối với API (cần credentials từ shipping config)',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Lỗi khi tạo đơn VTP',
    };
  }
}

/**
 * Creates shipping order with J&T
 * TODO: Integrate with JNTService class and shipping config
 */
async function createJNTOrder(
  params: CreateShippingOrderParams
): Promise<CreateShippingOrderResult> {
  try {
    const { config, pickupAddress, deliveryAddress, packageInfo, orderId, pickupProvince, pickupWard, deliveryProvince, deliveryWard } = params;

    // Map 2-level addresses to 3-level format
    const pickup3Level = mapTo3Level(pickupProvince, pickupWard);
    const delivery3Level = mapTo3Level(deliveryProvince, deliveryWard);

    console.log('J&T Order Data Structure:', {
      txlogisticId: orderId,
      
      sender: {
        name: pickupAddress.name,
        phone: pickupAddress.phone,
        address: pickupAddress.address,
        province: pickup3Level.provinceName,
        city: pickup3Level.districtName, // Mapped from province name
        area: pickup3Level.wardName,
      },
      
      receiver: {
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        address: deliveryAddress.address,
        province: delivery3Level.provinceName,
        city: delivery3Level.districtName, // Mapped from province name
        area: delivery3Level.wardName,
      },
      
      weight: packageInfo.weight / 1000, // Convert to kg
      length: packageInfo.length || 1,
      width: packageInfo.width || 1,
      height: packageInfo.height || 1,
      
      payType: config.options.payer === 'SHOP' ? 'PP_PM' : 'CC_CASH',
      itemValue: packageInfo.codAmount || 0,
      
      remark: config.options.note,
    });

    // TODO: Implement actual API call
    // const jntService = new JNTService(credentials);
    // const response = await jntService.createOrder(orderData);
    
    return {
      success: false,
      error: 'J&T createOrder - Chưa kết nối với API (cần credentials từ shipping config)',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Lỗi khi tạo đơn J&T',
    };
  }
}

/**
 * Main function to create shipping order
 * Routes to appropriate partner API based on selected service
 */
export async function createShippingOrder(
  params: CreateShippingOrderParams
): Promise<CreateShippingOrderResult> {
  // Validate data first
  const validation = validateShippingData(params);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  const { selectedService } = params;

  // Route to appropriate partner
  switch (selectedService.partnerCode) {
    case 'ghn':
      return createGHNOrder(params);
    
    case 'ghtk':
      return createGHTKOrder(params);
    
    case 'vtp':
      return createVTPOrder(params);
    
    case 'jnt':
      return createJNTOrder(params);
    
    case 'spx':
      return {
        success: false,
        error: 'SPX (Shopee Express) chỉ có thể tạo đơn qua nền tảng Shopee. Vui lòng sử dụng đơn vị vận chuyển khác.',
      };
    
    default:
      return {
        success: false,
        error: `Đơn vị vận chuyển ${selectedService.partnerCode} chưa được hỗ trợ`,
      };
  }
}
