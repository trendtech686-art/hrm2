/**
 * GHTK (Giao Hàng Tiết Kiệm) API Integration Service
 * Documentation: https://api.ghtk.vn/
 */

import { getBaseUrl } from '@/lib/api-config';

// ✅ Use local proxy server to avoid CORS
const GHTK_BASE_URL = `${getBaseUrl()}/api/shipping/ghtk`;

// GHTK API Response types
export type GHTKShippingFeeResponse = {
  success: boolean;
  message: string;
  fee: {
    name: string; // area1, area2, area3
    fee: number; // Phí vận chuyển (VNĐ)
    insurance_fee: number; // Phí khai giá (VNĐ)
    delivery: boolean; // Hỗ trợ giao hàng
    delivery_type?: string | undefined;
    extFees?: Array<{
      display: string;
      title: string;
      amount: number;
      type: string;
    }> | undefined;
  };
};

export type GHTKCreateOrderResponse = {
  success: boolean;
  message: string;
  order?: {
    partner_id: string;
    label: string; // Mã vận đơn GHTK
    area: string;
    fee: string;
    insurance_fee: string;
    tracking_id: number;
    estimated_pick_time: string;
    estimated_deliver_time: string;
    status_id: number;
  } | undefined;
  error?: {
    code: string;
    partner_id?: string | undefined;
    ghtk_label?: string | undefined;
    created?: string | undefined;
    status?: number | undefined;
  } | undefined;
};

export type GHTKOrderStatusResponse = {
  success: boolean;
  message: string;
  order?: {
    label_id: string; // Mã GHTK
    partner_id: string; // Mã đối tác
    status: string; // Mã trạng thái
    status_text: string;
    created: string;
    modified: string;
    message: string;
    pick_date: string;
    deliver_date: string;
    customer_fullname: string;
    customer_tel: string;
    address: string;
    storage_day: number;
    ship_money: number;
    insurance: number;
    value: number;
    weight: number;
    pick_money: number;
    is_freeship: number;
  } | undefined;
};

export type GHTKCreateOrderParams = {
  // Thông tin đơn hàng
  orderId: string; // Mã đơn hàng của shop
  
  // Điểm lấy hàng
  pickAddressId?: string | undefined; // ID kho lấy hàng từ GHTK (nếu có - ưu tiên dùng)
  pickName?: string | undefined; // ⚠️ REQUIRED - Tên người gửi (cần cả khi có pickAddressId)
  pickAddress?: string | undefined; // ⚠️ REQUIRED - Địa chỉ lấy hàng (cần cả khi có pickAddressId!)
  pickTel?: string | undefined; // ⚠️ REQUIRED - SĐT người gửi (cần cả khi có pickAddressId)
  pickProvince?: string | undefined; // Chỉ cần khi KHÔNG có pickAddressId
  pickDistrict?: string | undefined; // Chỉ cần khi KHÔNG có pickAddressId
  pickWard?: string | undefined; // Chỉ cần khi KHÔNG có pickAddressId
  pickStreet?: string | undefined; // Chỉ cần khi KHÔNG có pickAddressId
  
  // Điểm giao hàng
  customerName: string;
  customerAddress: string;
  customerProvince: string;
  customerDistrict: string;
  customerWard: string;
  customerStreet?: string | undefined;
  customerTel: string;
  customerHamlet?: string | undefined; // Thôn/ấp (nếu không có street)
  
  // Thông tin hàng hóa
  products: Array<{
    name: string;
    weight: number; // KG
    quantity: number;
    price?: number | undefined;
    productCode?: string | undefined;
    height?: number | undefined; // cm
    width?: number | undefined; // cm
    length?: number | undefined; // cm
  }>;
  
  // Thông tin thanh toán
  pickMoney: number; // Tiền CoD
  value: number; // Giá trị khai giá
  isFreeship?: number | boolean | undefined; // Shop trả ship hay không (0/1 or false/true)
  failedDeliveryFee?: number | undefined; // ✅ Số tiền thu khi không giao được (tag 19) - Sẽ map sang not_delivered_fee
  
  // Thông tin bổ sung
  note?: string | undefined;
  transport?: 'road' | 'fly' | undefined; // Đường bộ hoặc bay
  tags?: number[] | undefined; // Nhãn đơn hàng
  weightOption?: 'gram' | 'kilogram' | undefined; // Đơn vị khối lượng
  totalWeight?: number | undefined; // Tổng khối lượng (theo weightOption)
  totalBox?: number | undefined; // ✅ Tổng số kiện hàng
  
  // Ngày giờ
  pickDate?: string | undefined; // YYYY/MM/DD (format: YYYY-MM-DD)
  deliverDate?: string | undefined; // YYYY/MM/DD
  pickWorkShift?: 1 | 2 | undefined; // 1=sáng, 2=chiều
  deliverWorkShift?: 1 | 2 | undefined; // 1=sáng, 2=chiều
};

export type GHTKCalculateFeeParams = {
  // Điểm lấy hàng
  pickProvince: string;
  pickDistrict: string;
  pickWard?: string | undefined;
  
  // Điểm giao hàng
  province: string;
  district: string;
  ward?: string | undefined;
  address?: string | undefined;
  
  // Thông tin hàng hóa
  weight: number; // KG (not gram!) - GHTK API uses KG
  value?: number | undefined; // Giá trị khai giá (VNĐ)
  transport?: 'road' | 'fly' | undefined;
  tags?: number[] | undefined;
};

/**
 * GHTK Service Class
 */
export class GHTKService {
  private apiToken: string;
  private partnerCode: string;

  constructor(apiToken: string, partnerCode: string = '') {
    this.apiToken = apiToken;
    this.partnerCode = partnerCode;
  }

  /**
   * Tính phí vận chuyển
   */
  async calculateShippingFee(
    params: GHTKCalculateFeeParams
  ): Promise<GHTKShippingFeeResponse> {
    // ✅ Call through proxy server
    const payload = {
      apiToken: this.apiToken,
      partnerCode: this.partnerCode,
      pick_province: params.pickProvince,
      pick_district: params.pickDistrict,
      pick_ward: params.pickWard,
      province: params.province,
      district: params.district,
      ward: params.ward,
      address: params.address,
      weight: params.weight * 1000, // ✅ Convert KG to GRAM for fee API
      value: params.value,
      transport: params.transport,
      tags: params.tags,
    };

    const response = await fetch(`${GHTK_BASE_URL}/calculate-fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `GHTK API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(
    params: GHTKCreateOrderParams
  ): Promise<GHTKCreateOrderResponse> {
    // ⚠️ GHTK limitation: Cannot create orders >= 20,000 gram (20kg)
    const totalWeightGram = params.totalWeight || params.products.reduce((sum, p) => sum + (p.weight * p.quantity), 0);
    
    if (totalWeightGram >= 20000) {
      throw new Error(`GHTK không hỗ trợ đơn hàng ≥20kg (${totalWeightGram}g). Vui lòng liên hệ GHTK để được hỗ trợ dịch vụ BBS cho hàng nặng.`);
    }
    
    // ✅ Call through proxy server
    console.log('[GHTKService.createOrder] pickAddressId:', params.pickAddressId, 'type:', typeof params.pickAddressId);
    
    const payload: any = {
      apiToken: this.apiToken,
      partnerCode: this.partnerCode,
      
      // ⚠️ CRITICAL GHTK API STRUCTURE - UPDATED:
      // According to GHTK API behavior (error 30207 testing):
      // 
      // pick_address_id = ID của KHO GHTK (từ API /services/shipment/list_pick_address_id)
      // 
      // ⚠️ IMPORTANT: Ngay cả khi có pick_address_id, GHTK VẪN YÊU CẦU đầy đủ thông tin địa chỉ!
      //    - Phải gửi: pick_name, pick_address, pick_province, pick_district, pick_tel
      //    - pick_address_id CHỈ dùng để xác định kho ưu tiên, KHÔNG thay thế địa chỉ chi tiết
      //    - Nếu thiếu pick_address → Error 30207 "Vui lòng nhập địa chỉ lấy hàng hóa"
      
      // ✅ Pickup info - ALWAYS send full address details
      pick_name: params.pickName || 'Người gửi', // ⚠️ REQUIRED
      pick_address: params.pickAddress || '', // ⚠️ REQUIRED - địa chỉ chi tiết kho
      pick_province: params.pickProvince || '', // ⚠️ REQUIRED
      pick_district: params.pickDistrict || '', // ⚠️ REQUIRED
      pick_ward: params.pickWard || '',
      pick_tel: params.pickTel || '', // ⚠️ REQUIRED
      
      // ✅ pick_address_id is OPTIONAL, only add if available
      ...(params.pickAddressId ? {
        pick_address_id: params.pickAddressId, // ID kho GHTK (optional but recommended)
      } : {}),
      
      // ✅ Customer/Recipient info (always use generic field names)
      name: params.customerName,
      address: params.customerAddress,
      province: params.customerProvince,
      district: params.customerDistrict,
      ward: params.customerWard,
      street: params.customerStreet,
      hamlet: params.customerHamlet || 'Khác',
      tel: params.customerTel,
      
      // Order info
      id: params.orderId,
      products: params.products.map(p => ({
        name: p.name,
        weight: p.weight, // ✅ Already in GRAM from order-form-page
        quantity: p.quantity,
        product_code: p.productCode || 'DEFAULT',
        price: p.price || 0, // ✅ Add price
      })),
      total_weight: params.totalWeight, // ✅ Already in GRAM
      weight_option: 'gram', // ✅ GHTK requires this
      total_box: params.totalBox, // ✅ Total number of boxes
      value: params.value,
      transport: params.transport || 'road',
      pick_option: 'cod', // ✅ GHTK requires this
      note: params.note,
      
      // Payment
      is_freeship: params.isFreeship === 1 || params.isFreeship === true ? 1 : 0, // ✅ Force convert to 0 or 1
      pick_money: params.pickMoney || 0,  // ✅ ALWAYS use pickMoney for COD
      
      // ✅ NEW: not_delivered_fee field for tag 19 (Không giao được thu phí)
      // According to GHTK docs: Must pass not_delivered_fee when using tag 19
      // Range: 0 < not_delivered_fee <= 20,000,000
      ...(params.tags?.includes(19) && params.failedDeliveryFee ? {
        not_delivered_fee: params.failedDeliveryFee
      } : {}),
      
      // ✅ Dates & shifts
      pick_date: params.pickDate, // YYYY-MM-DD format
      deliver_date: params.deliverDate, // YYYY-MM-DD format
      pick_work_shift: params.pickWorkShift, // 1=sáng, 2=chiều
      deliver_work_shift: params.deliverWorkShift, // 1=sáng, 2=chiều
      
      // Tags
      tags: params.tags,
    };

    console.log('📤 [GHTKService] FINAL payload before sending to GHTK:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${GHTK_BASE_URL}/submit-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 [GHTKService] Response status:', response.status);
    console.log('📡 [GHTKService] Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('📡 [GHTKService] Error data:', errorData);
      throw new Error(errorData.error || errorData.message || `GHTK API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📡 [GHTKService] Response data:', data);
    
    // ✅ Handle GHTK error response (success: false)
    if (!data.success) {
      console.error('📡 [GHTKService] API returned error:', data.message);
      throw new Error(data.message || 'GHTK API returned error');
    }
    
    return data;
  }

  /**
   * Kiểm tra trạng thái đơn hàng
   */
  async getOrderStatus(
    trackingCode: string
  ): Promise<GHTKOrderStatusResponse> {
    const url = `${GHTK_BASE_URL}/services/shipment/v2/${trackingCode}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': this.apiToken,
        'X-Client-Source': this.partnerCode,
      },
    });

    if (!response.ok) {
      throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * In nhãn đơn hàng (shipping label)
   */
  async printLabel(trackingCode: string): Promise<{ success: boolean; label?: string; message: string }> {
    const url = `${GHTK_BASE_URL}/services/label/${trackingCode}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': this.apiToken,
        'X-Client-Source': this.partnerCode,
      },
    });

    if (!response.ok) {
      throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(trackingCode: string): Promise<{ success: boolean; message: string }> {
    const url = `${GHTK_BASE_URL}/services/shipment/cancel/${trackingCode}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Token': this.apiToken,
        'X-Client-Source': this.partnerCode,
      },
    });

    if (!response.ok) {
      throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

/**
 * GHTK Status Code Mapping
 * https://api.ghtk.vn/docs/submit-order/webhook
 */
export const GHTK_STATUS_MAP: Record<string, { text: string; color: string }> = {
  '-1': { text: 'Hủy đơn hàng', color: 'destructive' },
  '1': { text: 'Chưa tiếp nhận', color: 'secondary' },
  '2': { text: 'Đã tiếp nhận', color: 'info' },
  '3': { text: 'Đã lấy hàng/Đã nhập kho', color: 'warning' },
  '4': { text: 'Đã điều phối giao hàng/Đang giao hàng', color: 'warning' },
  '5': { text: 'Đã giao hàng/Chưa đối soát', color: 'success' },
  '6': { text: 'Đã đối soát', color: 'success' },
  '7': { text: 'Không lấy được hàng', color: 'destructive' },
  '8': { text: 'Hoãn lấy hàng', color: 'warning' },
  '9': { text: 'Không giao được hàng', color: 'destructive' },
  '10': { text: 'Delay giao hàng', color: 'warning' },
  '11': { text: 'Đã đối soát công nợ trả hàng', color: 'secondary' },
  '12': { text: 'Đã điều phối lấy hàng/Đang lấy hàng', color: 'warning' },
  '13': { text: 'Đơn hàng bồi hoàn', color: 'destructive' },
  '20': { text: 'Đang trả hàng (COD cầm hàng đi trả)', color: 'warning' },
  '21': { text: 'Đã trả hàng', color: 'secondary' },
  '123': { text: 'Shipper báo đã lấy hàng', color: 'info' },
  '127': { text: 'Shipper (nhân viên lấy/giao hàng) báo không lấy được hàng', color: 'destructive' },
  '128': { text: 'Shipper báo delay lấy hàng', color: 'warning' },
  '45': { text: 'Shipper báo đã giao hàng', color: 'success' },
  '49': { text: 'Shipper báo không giao được giao hàng', color: 'destructive' },
  '410': { text: 'Shipper báo delay giao hàng', color: 'warning' },
};

/**
 * GHTK Tags (Nhãn đơn hàng)
 */
export const GHTK_TAGS = {
  FRAGILE: 1, // Hàng dễ vỡ
  HIGH_VALUE: 2, // Giá trị cao (>3M)
  BULKY: 3, // Hàng cồng kềnh
  DOCUMENT: 4, // Chứng từ
  FOOD: 5, // Nông sản/Thực phẩm
  TRY_BEFORE_BUY: 10, // Cho xem hàng
  CALL_SHOP: 13, // Gọi shop khi khách không nhận
  PARTIAL_DELIVERY_SELECT: 17, // Giao 1 phần chọn sản phẩm
  PARTIAL_DELIVERY_EXCHANGE: 18, // Giao 1 phần đổi trả
  NO_DELIVERY_FEE: 19, // Không giao được thu phí
} as const;
