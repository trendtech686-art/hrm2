/**
 * J&T Express API Integration Service
 * Documentation: https://developer.jet.co.id/documentation/index
 * 
 * Auth: data_param (JSON) + data_sign = base64(md5(data_param + key))
 * Content-Type: application/x-www-form-urlencoded
 * Tracking: Basic Auth (separate password)
 */

import { getBaseUrl } from '@/lib/api-config';
import { logError } from '@/lib/logger'

// Use local proxy to avoid CORS
const JNT_BASE_URL = `${getBaseUrl()}/api/shipping/jnt`;

// === Response Types ===

export type JNTCreateOrderResponse = {
  success: boolean;
  desc: string;
  detail: Array<{
    awb_no?: string;
    orderid: string;
    desCode?: string;
    etd?: string; // Estimated time of delivery e.g. "2-4"
    status: string; // 'Sukses' | 'Error'
    reason?: string;
  }>;
};

export type JNTTrackingResponse = {
  awb?: string;
  orderid?: string;
  error_id?: string;
  error_message?: string;
  detail?: {
    shipped_date: string;
    services_code: string;
    actual_amount: number;
    weight: number;
    qty: number;
    itemname: string;
    detail_cost: {
      shipping_cost: number;
      add_cost: number;
      insurance_cost: number;
      cod: number;
      return_cost: number;
    };
    sender: { name: string; addr: string; city: string };
    receiver: { name: string; addr: string; zipcode: string; city: string };
    driver: { name: string; phone?: string };
    delivDriver: { name: string; phone: string };
  };
  history?: Array<{
    date_time: string;
    city_name: string;
    status: string;
    status_code: number;
    storeName: string;
    nextSiteName: string;
    note: string;
    receiver: string;
    driverName: string;
    driverPhone: string;
  }>;
};

export type JNTCancelOrderResponse = {
  success: boolean;
  desc: string;
  detail: Array<{
    orderid: string;
    status: string; // 'Sukses' | 'Error'
    reason?: string;
  }>;
};

export type JNTTariffCheckResponse = {
  is_success: string; // 'true' | 'false'
  message: string;
  content: string; // JSON string: [{"name":"EZ","cost":"9000"}]
};

// === Params Types ===

export type JNTCreateOrderParams = {
  // Order identification
  orderId: string; // Max 20 chars, use "-" as separator

  // Sender info
  shipperName: string; // Max 30
  shipperContact: string; // Max 30
  shipperPhone: string; // Max 15, format +84xxx
  shipperAddr: string; // Max 200
  originCode: string; // City code e.g. 'SGN' (UPPERCASE)

  // Receiver info
  receiverName: string; // Max 30
  receiverPhone: string; // Max 15, format +84xxx
  receiverAddr: string; // Max 200
  receiverZip: string; // 5 chars, '00000' if unknown
  destinationCode: string; // City code (UPPERCASE)
  receiverArea: string; // District code e.g. 'SGN001' (UPPERCASE)

  // Package info
  qty: number;
  weight: number; // KG, up to 2 decimal places
  goodsdesc: string; // Max 40, no special chars
  itemName: string; // Max 50, no special chars
  goodsvalue: number; // Goods value

  // Service
  serviceType: 1 | 6; // 1=Pickup, 6=Drop-off
  expressType: string; // '1' = EZ (Regular)

  // Optional
  insurance?: number;
  cod?: number; // COD amount, up to 8 digit

  // Dates (YYYY-MM-DD hh:mm:ss, UTC+7)
  orderDate: string;
  sendStartTime: string;
  sendEndTime: string;
};

export type JNTCalculateFeeParams = {
  weight: number; // KG
  sendSiteCode: string; // Origin city code (UPPERCASE)
  destAreaCode: string; // Destination district code (UPPERCASE)
  cusName: string; // Customer name from J&T dashboard
  productType: string; // 'EZ'
};

/**
 * J&T Express Service Class
 * All API calls go through our proxy server (/api/shipping/jnt/*) to:
 * 1. Avoid CORS issues
 * 2. Handle signature generation server-side (key never exposed to client)
 * 3. Consistent error handling
 */
export class JNTService {
  private username: string;
  private apiKey: string;

  constructor(username: string, apiKey: string) {
    this.username = username;
    this.apiKey = apiKey;
  }

  /**
   * Tạo đơn hàng J&T
   */
  async createOrder(params: JNTCreateOrderParams): Promise<JNTCreateOrderResponse> {
    const response = await fetch(`${JNT_BASE_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.username,
        api_key: this.apiKey,
        ...params,
      }),
    });

    const responseText = await response.text();
    let data: JNTCreateOrderResponse;
    try {
      data = JSON.parse(responseText);
    } catch {
      logError('[JNTService] Invalid JSON response', null, {
        status: response.status,
        body: responseText.substring(0, 500),
      });
      throw new Error('J&T trả về dữ liệu không hợp lệ. Vui lòng thử lại.');
    }

    if (!response.ok) {
      throw new Error(`Lỗi J&T: ${response.status} ${response.statusText}`);
    }

    const detail = data.detail?.[0];
    if (detail?.status === 'Error') {
      throw new Error(detail.reason || 'J&T trả về lỗi không xác định');
    }

    return data;
  }

  /**
   * Tracking đơn hàng (Basic Auth via proxy)
   */
  async getOrderStatus(awbNumber: string): Promise<JNTTrackingResponse> {
    const response = await fetch(`${JNT_BASE_URL}/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        awb: awbNumber,
        username: this.username,
        api_key: this.apiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`J&T Tracking Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error_id) {
      throw new Error(data.error_message || 'Không tìm thấy đơn hàng');
    }

    return data;
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(orderId: string, remark: string = 'Hủy bởi người gửi'): Promise<JNTCancelOrderResponse> {
    const response = await fetch(`${JNT_BASE_URL}/cancel-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.username,
        api_key: this.apiKey,
        orderid: orderId,
        remark,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Lỗi J&T: ${response.status}`);
    }

    const detail = data.detail?.[0];
    if (detail?.status === 'Error') {
      throw new Error(detail.reason || 'Không thể hủy đơn hàng');
    }

    return data;
  }

  /**
   * Kiểm tra phí vận chuyển (Tariff)
   */
  async calculateFee(params: JNTCalculateFeeParams): Promise<JNTTariffCheckResponse> {
    const response = await fetch(`${JNT_BASE_URL}/calculate-fee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Lỗi J&T: ${response.status}`);
    }

    return await response.json();
  }
}

