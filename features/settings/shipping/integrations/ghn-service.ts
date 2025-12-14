/**
 * GHN (Giao Hàng Nhanh) API Integration Service
 * Documentation: https://api.ghn.vn/home/docs/detail
 * API Base URL: https://online-gateway.ghn.vn/shiip/public-api
 */

const GHN_BASE_URL = 'https://online-gateway.ghn.vn/shiip/public-api';

// GHN API Response types
export type GHNShippingFeeResponse = {
  code: number;
  message: string;
  data?: {
    total: number; // Tổng phí vận chuyển
    service_fee: number; // Phí dịch vụ
    insurance_fee: number; // Phí bảo hiểm
    pick_station_fee: number; // Phí lấy hàng
    coupon_value: number; // Giá trị coupon
    r2s_fee: number; // Phí return to sender
  } | undefined;
};

export type GHNCreateOrderResponse = {
  code: number;
  message: string;
  data?: {
    order_code: string; // Mã đơn hàng GHN
    sort_code: string; // Mã phân loại
    trans_type: string; // Loại vận chuyển
    ward_encode: string;
    district_encode: string;
    fee: {
      main_service: number;
      insurance: number;
      cod_fee: number;
      station_do: number;
      station_pu: number;
      return: number;
      r2s: number;
      coupon: number;
    };
    total_fee: number;
    expected_delivery_time: string; // ISO date
  } | undefined;
};

export type GHNOrderStatusResponse = {
  code: number;
  message: string;
  data?: {
    order_code: string;
    status: string; // ready_to_pick, picking, money_collect_picking, picked, storing, transporting, sorting, delivering, money_collect_delivering, delivered, delivery_fail, waiting_to_return, return, return_transporting, return_sorting, returning, return_fail, returned, exception, damage, lost
    status_text: string;
    log: Array<{
      status: string;
      updated_date: string;
      reason_code: string;
      reason: string;
    }>;
    to_name: string;
    to_phone: string;
    to_address: string;
    to_ward_code: string;
    to_district_id: number;
    return_name: string;
    return_phone: string;
    return_address: string;
    client_order_code: string;
    cod_amount: number;
    content: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    pick_station_id: number;
    deliver_station_id: number;
    insurance_value: number;
    service_type_id: number;
    payment_type_id: number;
    note: string;
    coupon: string;
    _id: string;
    order_value: number;
    created_date: string;
    updated_date: string;
  } | undefined;
};

export type GHNCalculateFeeParams = {
  // Service & Payment
  service_type_id?: number | undefined; // 2: Express, 5: Standard
  payment_type_id?: number | undefined; // 1: Shop trả, 2: Người nhận trả
  
  // From
  from_district_id: number; // Mã quận/huyện lấy hàng
  from_ward_code?: string | undefined; // Mã phường/xã lấy hàng
  
  // To
  to_district_id: number; // Mã quận/huyện giao hàng
  to_ward_code: string; // Mã phường/xã giao hàng
  
  // Package info
  weight: number; // Gram
  length?: number | undefined; // cm
  width?: number | undefined; // cm
  height?: number | undefined; // cm
  
  // Value
  insurance_value?: number | undefined; // Giá trị khai báo bảo hiểm
  cod_value?: number | undefined; // Tiền CoD
  
  // Coupon
  coupon?: string | undefined;
};

export type GHNCreateOrderParams = {
  // Service & Payment
  service_type_id?: number | undefined; // 2: Express, 5: Standard (default: 2)
  payment_type_id: number; // 1: Shop trả, 2: Người nhận trả
  
  // Required flag
  required_note: 'CHOTHUHANG' | 'CHOXEMHANGKHONGTHU' | 'KHONGCHOXEMHANG'; // Cho thử hàng | Cho xem hàng không thử | Không cho xem hàng
  
  // Order info
  client_order_code?: string | undefined; // Mã đơn hàng của shop (optional)
  note?: string | undefined;
  content: string; // Nội dung đơn hàng
  
  // From (Shop)
  from_name: string;
  from_phone: string;
  from_address: string;
  from_ward_code?: string | undefined;
  from_district_id: number;
  from_province_id?: number | undefined;
  
  // To (Customer)
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_code: string;
  to_district_id: number;
  
  // Return address (optional, default = from)
  return_name?: string | undefined;
  return_phone?: string | undefined;
  return_address?: string | undefined;
  return_ward_code?: string | undefined;
  return_district_id?: number | undefined;
  
  // Package info
  weight: number; // Gram (min: 1)
  length: number; // cm (min: 1)
  width: number; // cm (min: 1)
  height: number; // cm (min: 1)
  
  // Value
  cod_amount: number; // Tiền CoD (VNĐ)
  insurance_value?: number | undefined; // Giá trị khai báo bảo hiểm (VNĐ)
  
  // Items (optional for better tracking)
  items?: Array<{
    name: string;
    code?: string | undefined;
    quantity: number;
    price?: number | undefined; // đơn giá
    weight?: number | undefined; // gram
    length?: number | undefined; // cm
    width?: number | undefined; // cm
    height?: number | undefined; // cm
  }> | undefined;
  
  // Pickup
  pick_station_id?: number | undefined; // Bưu cục lấy hàng
  deliver_station_id?: number | undefined; // Bưu cục giao hàng
  
  // Coupon
  coupon?: string | undefined;
};

/**
 * GHN Service Class
 */
export class GHNService {
  private apiToken: string;
  private shopId?: string | undefined; // Optional: Shop ID for some endpoints

  constructor(apiToken: string, shopId?: string | undefined) {
    this.apiToken = apiToken;
    this.shopId = shopId;
  }

  /**
   * Tính phí vận chuyển
   * API: POST /v2/shipping-order/fee
   */
  async calculateShippingFee(
    params: GHNCalculateFeeParams
  ): Promise<GHNShippingFeeResponse> {
    const url = `${GHN_BASE_URL}/v2/shipping-order/fee`;
    
    const payload = {
      service_type_id: params.service_type_id || 2, // Default: Express
      payment_type_id: params.payment_type_id || 1, // Default: Shop trả
      from_district_id: params.from_district_id,
      from_ward_code: params.from_ward_code,
      to_district_id: params.to_district_id,
      to_ward_code: params.to_ward_code,
      weight: params.weight,
      length: params.length,
      width: params.width,
      height: params.height,
      insurance_value: params.insurance_value,
      cod_value: params.cod_value,
      coupon: params.coupon,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
        ...(this.shopId && { 'ShopId': this.shopId }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Tạo đơn hàng mới
   * API: POST /v2/shipping-order/create
   */
  async createOrder(
    params: GHNCreateOrderParams
  ): Promise<GHNCreateOrderResponse> {
    const url = `${GHN_BASE_URL}/v2/shipping-order/create`;
    
    const payload = {
      payment_type_id: params.payment_type_id,
      service_type_id: params.service_type_id || 2, // Default: Express
      required_note: params.required_note,
      
      // Order
      client_order_code: params.client_order_code,
      note: params.note,
      content: params.content,
      
      // From
      from_name: params.from_name,
      from_phone: params.from_phone,
      from_address: params.from_address,
      from_ward_code: params.from_ward_code,
      from_district_id: params.from_district_id,
      from_province_id: params.from_province_id,
      
      // To
      to_name: params.to_name,
      to_phone: params.to_phone,
      to_address: params.to_address,
      to_ward_code: params.to_ward_code,
      to_district_id: params.to_district_id,
      
      // Return
      return_name: params.return_name || params.from_name,
      return_phone: params.return_phone || params.from_phone,
      return_address: params.return_address || params.from_address,
      return_ward_code: params.return_ward_code || params.from_ward_code,
      return_district_id: params.return_district_id || params.from_district_id,
      
      // Package
      weight: params.weight,
      length: params.length,
      width: params.width,
      height: params.height,
      
      // Value
      cod_amount: params.cod_amount,
      insurance_value: params.insurance_value,
      
      // Items
      items: params.items,
      
      // Pickup
      pick_station_id: params.pick_station_id,
      deliver_station_id: params.deliver_station_id,
      
      // Coupon
      coupon: params.coupon,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
        ...(this.shopId && { 'ShopId': this.shopId }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Kiểm tra trạng thái đơn hàng
   * API: POST /v2/shipping-order/detail
   */
  async getOrderStatus(
    orderCode: string
  ): Promise<GHNOrderStatusResponse> {
    const url = `${GHN_BASE_URL}/v2/shipping-order/detail`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify({ order_code: orderCode }),
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Hủy đơn hàng
   * API: POST /v2/switch-status/cancel
   */
  async cancelOrder(orderCodes: string[]): Promise<{ code: number; message: string; data?: any }> {
    const url = `${GHN_BASE_URL}/v2/switch-status/cancel`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
        ...(this.shopId && { 'ShopId': this.shopId }),
      },
      body: JSON.stringify({ order_codes: orderCodes }),
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Cập nhật đơn hàng
   * API: POST /v2/shipping-order/update
   */
  async updateOrder(
    orderCode: string,
    updates: Partial<GHNCreateOrderParams>
  ): Promise<{ code: number; message: string; data?: any }> {
    const url = `${GHN_BASE_URL}/v2/shipping-order/update`;

    const payload = {
      order_code: orderCode,
      ...updates,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
        ...(this.shopId && { 'ShopId': this.shopId }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   * API: GET /master-data/province
   */
  async getProvinces(): Promise<{ code: number; message: string; data: Array<{ ProvinceID: number; ProvinceName: string }> }> {
    const url = `${GHN_BASE_URL}/master-data/province`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': this.apiToken,
      },
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Lấy danh sách quận/huyện theo tỉnh
   * API: GET /master-data/district
   */
  async getDistricts(provinceId: number): Promise<{ code: number; message: string; data: Array<{ DistrictID: number; DistrictName: string }> }> {
    const url = `${GHN_BASE_URL}/master-data/district`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify({ province_id: provinceId }),
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   * API: GET /master-data/ward
   */
  async getWards(districtId: number): Promise<{ code: number; message: string; data: Array<{ WardCode: string; WardName: string }> }> {
    const url = `${GHN_BASE_URL}/master-data/ward`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify({ district_id: districtId }),
    });

    if (!response.ok) {
      throw new Error(`GHN API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

/**
 * GHN Status Code Mapping
 */
export const GHN_STATUS_MAP: Record<string, { text: string; color: string }> = {
  'ready_to_pick': { text: 'Chờ lấy hàng', color: 'secondary' },
  'picking': { text: 'Đang lấy hàng', color: 'warning' },
  'money_collect_picking': { text: 'Đang thu tiền người gửi', color: 'info' },
  'picked': { text: 'Đã lấy hàng', color: 'success' },
  'storing': { text: 'Đang lưu kho', color: 'info' },
  'transporting': { text: 'Đang vận chuyển', color: 'warning' },
  'sorting': { text: 'Đang phân loại', color: 'info' },
  'delivering': { text: 'Đang giao hàng', color: 'warning' },
  'money_collect_delivering': { text: 'Đang thu tiền người nhận', color: 'info' },
  'delivered': { text: 'Đã giao hàng', color: 'success' },
  'delivery_fail': { text: 'Giao hàng thất bại', color: 'destructive' },
  'waiting_to_return': { text: 'Chờ xác nhận hoàn', color: 'warning' },
  'return': { text: 'Đang hoàn', color: 'warning' },
  'return_transporting': { text: 'Đang vận chuyển hoàn', color: 'warning' },
  'return_sorting': { text: 'Đang phân loại hoàn', color: 'info' },
  'returning': { text: 'Đang trả hàng', color: 'warning' },
  'return_fail': { text: 'Hoàn hàng thất bại', color: 'destructive' },
  'returned': { text: 'Đã hoàn hàng', color: 'secondary' },
  'exception': { text: 'Đơn hàng ngoại lệ', color: 'destructive' },
  'damage': { text: 'Hàng bị hư hỏng', color: 'destructive' },
  'lost': { text: 'Hàng bị thất lạc', color: 'destructive' },
};

/**
 * GHN Service Types
 */
export const GHN_SERVICE_TYPES = {
  EXPRESS: 2, // Hỏa tốc
  STANDARD: 5, // Tiêu chuẩn
} as const;

/**
 * GHN Payment Types
 */
export const GHN_PAYMENT_TYPES = {
  SHOP_PAY: 1, // Shop trả phí
  CUSTOMER_PAY: 2, // Người nhận trả phí
} as const;
