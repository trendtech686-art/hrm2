/**
 * J&T Express API Integration Service
 * Documentation: https://developer.jet.co.id/documentation/index
 * 
 * IMPORTANT NOTES:
 * 1. Requires formal partnership with J&T Express
 * 2. Integration process: Contact agent → Agreement → API Integration & Mapping → Testing → Production
 * 3. Test environment available before production
 * 4. Need to inform operations team before deployment
 * 
 * Contact: Contact local J&T Express office for partnership
 */

const JNT_BASE_URL = 'https://api.jtexpress.vn/api'; // Vietnam API endpoint
const JNT_TEST_URL = 'https://test-api.jtexpress.vn/api'; // Test environment

// J&T Express API Response types
export type JNTShippingFeeResponse = {
  code: string; // "1" = success, other = error
  msg: string;
  data?: {
    fee: number; // Phí vận chuyển (VNĐ)
    vat: number; // VAT (VNĐ)
    totalFee: number; // Tổng phí (VNĐ)
    currency: string; // VND
  } | undefined;
};

export type JNTCreateOrderResponse = {
  code: string; // "1" = success
  msg: string;
  data?: {
    orderId: string; // Mã đơn hàng J&T
    billCode: string; // Mã vận đơn
    sortingCode: string; // Mã phân loại
    createTime: string; // Thời gian tạo
    deliveryTime?: string | undefined; // Thời gian giao dự kiến
  } | undefined;
};

export type JNTOrderStatusResponse = {
  code: string; // "1" = success
  msg: string;
  data?: {
    billCode: string;
    orderId: string;
    status: string; // ACCEPTED, PICKED_UP, IN_TRANSIT, DELIVERING, DELIVERED, RETURNING, RETURNED, CANCELLED
    statusName: string;
    createTime: string;
    updateTime: string;
    senderName: string;
    senderPhone: string;
    senderAddress: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    goodsName: string;
    weight: number;
    quantity: number;
    codAmount: number;
    note: string;
    traces?: Array<{
      status: string;
      statusName: string;
      scanTime: string;
      location: string;
      remark: string;
    }> | undefined;
  } | undefined;
};

export type JNTCalculateFeeParams = {
  // Test mode flag
  testMode?: boolean | undefined;
  
  // Sender info
  senderCity: string; // Tỉnh/TP gửi
  senderDistrict: string; // Quận/Huyện gửi
  senderWard?: string | undefined; // Phường/Xã gửi
  
  // Receiver info
  receiverCity: string; // Tỉnh/TP nhận
  receiverDistrict: string; // Quận/Huyện nhận
  receiverWard?: string | undefined; // Phường/Xã nhận
  
  // Package info
  weight: number; // Khối lượng (kg)
  length?: number | undefined; // Dài (cm)
  width?: number | undefined; // Rộng (cm)
  height?: number | undefined; // Cao (cm)
  
  // Service type
  serviceType?: string | undefined; // EZ: Economy, ES: Express
  
  // Value
  goodsValue?: number | undefined; // Giá trị hàng hóa (VNĐ)
  codAmount?: number | undefined; // Tiền CoD (VNĐ)
};

export type JNTCreateOrderParams = {
  // Test mode flag
  testMode?: boolean | undefined;
  
  // Order info
  orderId: string; // Mã đơn hàng của shop (unique)
  serviceType?: string | undefined; // EZ: Economy, ES: Express (default: EZ)
  paymentType?: 'PP_PM' | 'CC_CASH' | undefined; // PP_PM: Người gửi trả, CC_CASH: CoD
  
  // Sender info (Người gửi)
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string; // Tỉnh/TP
  senderDistrict: string; // Quận/Huyện
  senderWard?: string | undefined; // Phường/Xã
  senderPostcode?: string | undefined; // Mã bưu điện
  
  // Receiver info (Người nhận)
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string; // Tỉnh/TP (required)
  receiverDistrict: string; // Quận/Huyện (required)
  receiverWard?: string | undefined; // Phường/Xã
  receiverPostcode?: string | undefined; // Mã bưu điện
  receiverEmail?: string | undefined;
  
  // Package info
  goodsName: string; // Tên hàng hóa
  goodsDesc?: string | undefined; // Mô tả
  weight: number; // Khối lượng (kg)
  quantity: number; // Số lượng kiện
  length?: number | undefined; // Dài (cm)
  width?: number | undefined; // Rộng (cm)
  height?: number | undefined; // Cao (cm)
  
  // Value
  goodsValue?: number | undefined; // Giá trị hàng hóa (VNĐ)
  codAmount: number; // Tiền CoD (VNĐ)
  
  // Additional
  note?: string | undefined; // Ghi chú
  deliveryType?: 'HOME' | 'OFFICE' | undefined; // Loại địa chỉ giao hàng
  
  // Items list (optional for better tracking)
  items?: Array<{
    itemName: string;
    itemQuantity: number;
    itemPrice?: number | undefined;
    itemWeight?: number | undefined;
  }> | undefined;
};

/**
 * J&T Express Service Class
 */
export class JNTService {
  private apiKey: string;
  private apiSecret?: string | undefined;
  private customerCode?: string | undefined; // Mã khách hàng
  private testMode: boolean;

  constructor(apiKey: string, apiSecret?: string | undefined, customerCode?: string | undefined, testMode: boolean = false) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.customerCode = customerCode;
    this.testMode = testMode;
  }

  /**
   * Get base URL based on test mode
   */
  private getBaseUrl(): string {
    return this.testMode ? JNT_TEST_URL : JNT_BASE_URL;
  }

  /**
   * Generate signature for authentication (if required)
   * Implementation depends on J&T's authentication method
   */
  private generateSignature(params: any): string {
    // TODO: Implement based on J&T's signature algorithm
    // Usually MD5 or SHA256 hash of params + secret
    return this.apiSecret || '';
  }

  /**
   * Tính phí vận chuyển (Tariff Checking)
   * API: POST /tariff/check
   */
  async calculateShippingFee(
    params: JNTCalculateFeeParams
  ): Promise<JNTShippingFeeResponse> {
    const url = `${this.getBaseUrl()}/tariff/check`;
    
    const payload = {
      senderCity: params.senderCity,
      senderDistrict: params.senderDistrict,
      senderWard: params.senderWard,
      receiverCity: params.receiverCity,
      receiverDistrict: params.receiverDistrict,
      receiverWard: params.receiverWard,
      weight: params.weight,
      length: params.length,
      width: params.width,
      height: params.height,
      serviceType: params.serviceType || 'EZ',
      goodsValue: params.goodsValue,
      codAmount: params.codAmount,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
        ...(this.customerCode && { 'Customer-Code': this.customerCode }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`J&T API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Tạo đơn hàng mới (Order)
   * API: POST /order/create
   */
  async createOrder(
    params: JNTCreateOrderParams
  ): Promise<JNTCreateOrderResponse> {
    const url = `${this.getBaseUrl()}/order/create`;
    
    const payload = {
      orderId: params.orderId,
      serviceType: params.serviceType || 'EZ',
      paymentType: params.paymentType || 'PP_PM',
      
      // Sender
      senderName: params.senderName,
      senderPhone: params.senderPhone,
      senderAddress: params.senderAddress,
      senderCity: params.senderCity,
      senderDistrict: params.senderDistrict,
      senderWard: params.senderWard,
      senderPostcode: params.senderPostcode,
      
      // Receiver
      receiverName: params.receiverName,
      receiverPhone: params.receiverPhone,
      receiverAddress: params.receiverAddress,
      receiverCity: params.receiverCity,
      receiverDistrict: params.receiverDistrict,
      receiverWard: params.receiverWard,
      receiverPostcode: params.receiverPostcode,
      receiverEmail: params.receiverEmail,
      
      // Package
      goodsName: params.goodsName,
      goodsDesc: params.goodsDesc,
      weight: params.weight,
      quantity: params.quantity,
      length: params.length,
      width: params.width,
      height: params.height,
      
      // Value
      goodsValue: params.goodsValue,
      codAmount: params.codAmount,
      
      // Additional
      note: params.note,
      deliveryType: params.deliveryType || 'HOME',
      items: params.items,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
        ...(this.customerCode && { 'Customer-Code': this.customerCode }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`J&T API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Kiểm tra trạng thái đơn hàng (Tracking)
   * API: POST /order/track
   */
  async getOrderStatus(
    billCode: string
  ): Promise<JNTOrderStatusResponse> {
    const url = `${this.getBaseUrl()}/order/track`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
      },
      body: JSON.stringify({ billCode }),
    });

    if (!response.ok) {
      throw new Error(`J&T API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Hủy đơn hàng (Cancel Order)
   * API: POST /order/cancel
   */
  async cancelOrder(
    billCode: string,
    reason?: string
  ): Promise<{ code: string; msg: string; data?: any }> {
    const url = `${this.getBaseUrl()}/order/cancel`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
        ...(this.customerCode && { 'Customer-Code': this.customerCode }),
      },
      body: JSON.stringify({
        billCode,
        reason: reason || 'Khách hàng yêu cầu hủy',
      }),
    });

    if (!response.ok) {
      throw new Error(`J&T API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Cập nhật đơn hàng
   * API: POST /order/update
   */
  async updateOrder(
    billCode: string,
    updates: Partial<JNTCreateOrderParams>
  ): Promise<{ code: string; msg: string; data?: any }> {
    const url = `${this.getBaseUrl()}/order/update`;

    const payload = {
      billCode,
      ...updates,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
        ...(this.customerCode && { 'Customer-Code': this.customerCode }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`J&T API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

/**
 * J&T Status Code Mapping
 */
export const JNT_STATUS_MAP: Record<string, { text: string; color: string }> = {
  'ACCEPTED': { text: 'Đã tiếp nhận', color: 'secondary' },
  'PICKED_UP': { text: 'Đã lấy hàng', color: 'success' },
  'IN_TRANSIT': { text: 'Đang vận chuyển', color: 'warning' },
  'AT_SORTING_CENTER': { text: 'Đang phân loại', color: 'info' },
  'OUT_FOR_DELIVERY': { text: 'Đang giao hàng', color: 'warning' },
  'DELIVERING': { text: 'Đang giao hàng', color: 'warning' },
  'DELIVERED': { text: 'Đã giao hàng', color: 'success' },
  'DELIVERY_FAILED': { text: 'Giao hàng thất bại', color: 'destructive' },
  'RETURNING': { text: 'Đang hoàn hàng', color: 'warning' },
  'RETURNED': { text: 'Đã hoàn hàng', color: 'secondary' },
  'CANCELLED': { text: 'Đã hủy', color: 'destructive' },
  'EXCEPTION': { text: 'Đơn hàng ngoại lệ', color: 'destructive' },
  'LOST': { text: 'Thất lạc', color: 'destructive' },
  'DAMAGED': { text: 'Hư hỏng', color: 'destructive' },
};

/**
 * J&T Service Types
 */
export const JNT_SERVICE_TYPES = {
  ECONOMY: 'EZ', // Tiết kiệm
  EXPRESS: 'ES', // Nhanh
} as const;

/**
 * J&T Payment Types
 */
export const JNT_PAYMENT_TYPES = {
  SENDER_PAY: 'PP_PM', // Người gửi trả phí (PrePaid)
  COD: 'CC_CASH', // Thu hộ CoD
} as const;

/**
 * J&T Integration Process Guide
 * 
 * Step 1: Contact J&T Agent
 * - Contact local J&T Express office for partnership inquiry
 * - Provide business information and integration requirements
 * 
 * Step 2: Agreement Documentation
 * - Sign partnership agreement with J&T Express
 * - Receive API credentials (API Key, API Secret, Customer Code)
 * 
 * Step 3: API Integration & Mapping
 * - Implement API integration using this service class
 * - Map shop's address data with J&T's master data
 * - Configure webhook URLs for status updates (if needed)
 * 
 * Step 4: Testing
 * - Use test environment (testMode = true)
 * - Test all workflows: calculateFee → createOrder → trackOrder → cancelOrder
 * - Verify data mapping and status updates
 * - Get approval from J&T for production migration
 * 
 * Step 5: Production Deployment
 * - Switch to production environment (testMode = false)
 * - Update API credentials to production keys
 * - Inform J&T operations team before going live
 * - Monitor first orders and handle any issues
 * 
 * Support:
 * - Check developer.jet.co.id/documentation for latest API docs
 * - Contact J&T technical support for integration assistance
 */
