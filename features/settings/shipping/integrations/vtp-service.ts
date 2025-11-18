/**
 * ViettelPost (VTP) API Integration Service
 * Documentation: https://partner.viettelpost.vn (requires approval)
 * Integration Guide: https://docs.sudo.vn/viettelpost.html
 * Contact: 1900 8095 | 0862.235.888 | b2b@viettelpost.com.vn
 * 
 * NOTE: Requires ViettelPost partnership approval before using production API
 */

const VTP_BASE_URL = 'https://partner.viettelpost.vn/v2';

// ViettelPost API Response types
export type VTPShippingFeeResponse = {
  status: number; // 200: success
  message: string;
  data?: {
    MONEY_TOTAL: number; // Tổng phí (VNĐ)
    MONEY_COLLECTION: number; // Phí CoD
    MONEY_SERVICE: number; // Phí dịch vụ
    MONEY_VAS: number; // Phí dịch vụ gia tăng
    MONEY_OTHER_SERVICE: number; // Phí khác
    KPI_HT: number; // Thời gian dự kiến (giờ)
    EXCHANGE_WEIGHT: number; // Khối lượng quy đổi
  };
  error?: string;
};

export type VTPCreateOrderResponse = {
  status: number;
  message: string;
  data?: {
    ORDER_NUMBER: string; // Mã đơn hàng VTP
    MONEY_TOTAL: number; // Tổng cước
    MONEY_TOTAL_FEE: number; // Tổng phí
    KPI_HT: number; // Thời gian giao hàng dự kiến (giờ)
  };
  error?: string;
};

export type VTPOrderStatusResponse = {
  status: number;
  message: string;
  data?: {
    ORDER_NUMBER: string;
    ORDER_STATUS: number; // Trạng thái đơn hàng
    ORDER_STATUS_NAME: string;
    PRODUCT_TYPE: string; // VCN: Viettel Chuyển Phát Nhanh, VTK: Tiết kiệm
    ORDER_PAYMENT: number; // 1: Người gửi trả, 2: Người nhận trả, 3: Cả 2 trả
    ORDER_SERVICE: string;
    MONEY_COLLECTION: number;
    MONEY_TOTAL: number;
    SENDER_NAME: string;
    SENDER_PHONE: string;
    SENDER_ADDRESS: string;
    RECEIVER_NAME: string;
    RECEIVER_PHONE: string;
    RECEIVER_ADDRESS: string;
    PRODUCT_NAME: string;
    PRODUCT_QUANTITY: number;
    PRODUCT_WEIGHT: number;
    NOTE: string;
    CREATE_DATE: string;
    UPDATE_DATE: string;
    listOrderDetail?: Array<{
      ORDER_STATUS: number;
      ORDER_STATUS_NAME: string;
      STATUS_DATE: string;
      LOCATION_NAME: string;
      NOTE: string;
    }>;
  };
  error?: string;
};

export type VTPCalculateFeeParams = {
  // Product type
  PRODUCT_TYPE: 'VCN' | 'VTK'; // VCN: Nhanh, VTK: Tiết kiệm
  
  // Sender (Người gửi)
  SENDER_PROVINCE?: number; // ID Tỉnh/TP
  SENDER_DISTRICT?: number; // ID Quận/Huyện
  
  // Receiver (Người nhận)
  RECEIVER_PROVINCE: number; // ID Tỉnh/TP
  RECEIVER_DISTRICT: number; // ID Quận/Huyện
  
  // Package info
  PRODUCT_WEIGHT: number; // Gram
  PRODUCT_QUANTITY: number;
  PRODUCT_PRICE?: number; // Giá trị hàng hóa (VNĐ)
  
  // Order value & payment
  MONEY_COLLECTION?: number; // Tiền CoD (VNĐ)
  ORDER_SERVICE_ADD?: string; // Dịch vụ gia tăng (VD: "PBH,BH")
  ORDER_SERVICE?: string; // Mã dịch vụ
  
  // Insurance
  NATIONAL_TYPE?: number; // 1: Nội tỉnh, 2: Nội vùng, 3: Liên vùng
  TYPE?: number; // 1: Gửi bưu cục, 2: Thu hộ tận nơi
};

export type VTPCreateOrderParams = {
  // Order info
  ORDER_NUMBER: string; // Mã đơn hàng của shop (unique)
  GROUPADDRESS_ID?: number; // ID nhóm địa chỉ (nếu có)
  CUS_ID?: number; // Mã khách hàng
  
  // Product type & service
  PRODUCT_TYPE: 'VCN' | 'VTK'; // VCN: Nhanh, VTK: Tiết kiệm
  ORDER_PAYMENT: 1 | 2 | 3; // 1: Người gửi, 2: Người nhận, 3: Cả 2
  ORDER_SERVICE?: string; // Mã dịch vụ (VD: "VCN_DH")
  ORDER_SERVICE_ADD?: string; // Dịch vụ gia tăng (VD: "PBH,BH")
  ORDER_VOUCHER?: string; // Mã khuyến mãi
  ORDER_NOTE?: string; // Ghi chú
  
  // Sender info (Người gửi)
  SENDER_FULLNAME: string;
  SENDER_ADDRESS: string;
  SENDER_PHONE: string;
  SENDER_EMAIL?: string;
  SENDER_WARD?: number; // ID Phường/Xã
  SENDER_DISTRICT?: number; // ID Quận/Huyện
  SENDER_PROVINCE?: number; // ID Tỉnh/TP
  SENDER_LATITUDE?: number;
  SENDER_LONGITUDE?: number;
  
  // Receiver info (Người nhận)
  RECEIVER_FULLNAME: string;
  RECEIVER_ADDRESS: string;
  RECEIVER_PHONE: string;
  RECEIVER_EMAIL?: string;
  RECEIVER_WARD: number; // ID Phường/Xã (required)
  RECEIVER_DISTRICT: number; // ID Quận/Huyện (required)
  RECEIVER_PROVINCE: number; // ID Tỉnh/TP (required)
  RECEIVER_LATITUDE?: number;
  RECEIVER_LONGITUDE?: number;
  
  // Package info
  PRODUCT_NAME: string; // Tên hàng hóa
  PRODUCT_DESCRIPTION?: string; // Mô tả
  PRODUCT_QUANTITY: number; // Số lượng
  PRODUCT_WEIGHT: number; // Khối lượng (gram)
  PRODUCT_LENGTH?: number; // Dài (cm)
  PRODUCT_WIDTH?: number; // Rộng (cm)
  PRODUCT_HEIGHT?: number; // Cao (cm)
  PRODUCT_PRICE?: number; // Giá trị hàng hóa (VNĐ)
  
  // Money
  MONEY_COLLECTION: number; // Tiền CoD (VNĐ)
  MONEY_TOTALFEE?: number; // Tổng phí vận chuyển (VNĐ)
  MONEY_FEECOD?: number; // Phí CoD (VNĐ)
  MONEY_FEEVAS?: number; // Phí dịch vụ gia tăng (VNĐ)
  MONEY_FEEINSURRANCE?: number; // Phí bảo hiểm (VNĐ)
  MONEY_FEE?: number; // Phí dịch vụ (VNĐ)
  MONEY_FEEOTHER?: number; // Phí khác (VNĐ)
  MONEY_TOTALVAT?: number; // Tổng VAT (VNĐ)
  MONEY_TOTAL?: number; // Tổng tiền (VNĐ)
  
  // List products (for multi-item orders)
  LIST_ITEM?: Array<{
    PRODUCT_NAME: string;
    PRODUCT_QUANTITY: number;
    PRODUCT_PRICE?: number;
    PRODUCT_WEIGHT?: number;
    PRODUCT_LENGTH?: number;
    PRODUCT_WIDTH?: number;
    PRODUCT_HEIGHT?: number;
  }>;
};

/**
 * ViettelPost Service Class
 */
export class VTPService {
  private apiToken: string;
  private username?: string; // Account username
  private password?: string; // Account password

  constructor(apiToken: string, username?: string, password?: string) {
    this.apiToken = apiToken;
    this.username = username;
    this.password = password;
  }

  /**
   * Login to get API token (if not provided in constructor)
   * API: POST /user/Login
   */
  async login(username: string, password: string): Promise<{ status: number; data: { token: string } }> {
    const url = `${VTP_BASE_URL}/user/Login`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: username,
        PASSWORD: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (result.status === 200 && result.data?.token) {
      this.apiToken = result.data.token;
    }
    return result;
  }

  /**
   * Tính phí vận chuyển
   * API: POST /order/getPriceAll
   */
  async calculateShippingFee(
    params: VTPCalculateFeeParams
  ): Promise<VTPShippingFeeResponse> {
    const url = `${VTP_BASE_URL}/order/getPriceAll`;
    
    const payload = {
      PRODUCT_TYPE: params.PRODUCT_TYPE,
      SENDER_PROVINCE: params.SENDER_PROVINCE,
      SENDER_DISTRICT: params.SENDER_DISTRICT,
      RECEIVER_PROVINCE: params.RECEIVER_PROVINCE,
      RECEIVER_DISTRICT: params.RECEIVER_DISTRICT,
      PRODUCT_WEIGHT: params.PRODUCT_WEIGHT,
      PRODUCT_QUANTITY: params.PRODUCT_QUANTITY,
      PRODUCT_PRICE: params.PRODUCT_PRICE,
      MONEY_COLLECTION: params.MONEY_COLLECTION,
      ORDER_SERVICE_ADD: params.ORDER_SERVICE_ADD,
      ORDER_SERVICE: params.ORDER_SERVICE,
      NATIONAL_TYPE: params.NATIONAL_TYPE,
      TYPE: params.TYPE,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Tạo đơn hàng mới
   * API: POST /order/createOrder
   */
  async createOrder(
    params: VTPCreateOrderParams
  ): Promise<VTPCreateOrderResponse> {
    const url = `${VTP_BASE_URL}/order/createOrder`;
    
    const payload = {
      ORDER_NUMBER: params.ORDER_NUMBER,
      GROUPADDRESS_ID: params.GROUPADDRESS_ID,
      CUS_ID: params.CUS_ID,
      
      PRODUCT_TYPE: params.PRODUCT_TYPE,
      ORDER_PAYMENT: params.ORDER_PAYMENT,
      ORDER_SERVICE: params.ORDER_SERVICE,
      ORDER_SERVICE_ADD: params.ORDER_SERVICE_ADD,
      ORDER_VOUCHER: params.ORDER_VOUCHER,
      ORDER_NOTE: params.ORDER_NOTE,
      
      // Sender
      SENDER_FULLNAME: params.SENDER_FULLNAME,
      SENDER_ADDRESS: params.SENDER_ADDRESS,
      SENDER_PHONE: params.SENDER_PHONE,
      SENDER_EMAIL: params.SENDER_EMAIL,
      SENDER_WARD: params.SENDER_WARD,
      SENDER_DISTRICT: params.SENDER_DISTRICT,
      SENDER_PROVINCE: params.SENDER_PROVINCE,
      SENDER_LATITUDE: params.SENDER_LATITUDE,
      SENDER_LONGITUDE: params.SENDER_LONGITUDE,
      
      // Receiver
      RECEIVER_FULLNAME: params.RECEIVER_FULLNAME,
      RECEIVER_ADDRESS: params.RECEIVER_ADDRESS,
      RECEIVER_PHONE: params.RECEIVER_PHONE,
      RECEIVER_EMAIL: params.RECEIVER_EMAIL,
      RECEIVER_WARD: params.RECEIVER_WARD,
      RECEIVER_DISTRICT: params.RECEIVER_DISTRICT,
      RECEIVER_PROVINCE: params.RECEIVER_PROVINCE,
      RECEIVER_LATITUDE: params.RECEIVER_LATITUDE,
      RECEIVER_LONGITUDE: params.RECEIVER_LONGITUDE,
      
      // Product
      PRODUCT_NAME: params.PRODUCT_NAME,
      PRODUCT_DESCRIPTION: params.PRODUCT_DESCRIPTION,
      PRODUCT_QUANTITY: params.PRODUCT_QUANTITY,
      PRODUCT_WEIGHT: params.PRODUCT_WEIGHT,
      PRODUCT_LENGTH: params.PRODUCT_LENGTH,
      PRODUCT_WIDTH: params.PRODUCT_WIDTH,
      PRODUCT_HEIGHT: params.PRODUCT_HEIGHT,
      PRODUCT_PRICE: params.PRODUCT_PRICE,
      
      // Money
      MONEY_COLLECTION: params.MONEY_COLLECTION,
      MONEY_TOTALFEE: params.MONEY_TOTALFEE,
      MONEY_FEECOD: params.MONEY_FEECOD,
      MONEY_FEEVAS: params.MONEY_FEEVAS,
      MONEY_FEEINSURRANCE: params.MONEY_FEEINSURRANCE,
      MONEY_FEE: params.MONEY_FEE,
      MONEY_FEEOTHER: params.MONEY_FEEOTHER,
      MONEY_TOTALVAT: params.MONEY_TOTALVAT,
      MONEY_TOTAL: params.MONEY_TOTAL,
      
      // List items
      LIST_ITEM: params.LIST_ITEM,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Kiểm tra trạng thái đơn hàng
   * API: POST /order/getOrderInfoById
   */
  async getOrderStatus(
    orderNumber: string
  ): Promise<VTPOrderStatusResponse> {
    const url = `${VTP_BASE_URL}/order/getOrderInfoById`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify({ ORDER_NUMBER: orderNumber }),
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Hủy đơn hàng
   * API: POST /order/updateOrder
   */
  async cancelOrder(
    orderNumber: string,
    note?: string
  ): Promise<{ status: number; message: string; error?: string }> {
    const url = `${VTP_BASE_URL}/order/updateOrder`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify({
        ORDER_NUMBER: orderNumber,
        ORDER_STATUS: -1, // -1: Hủy đơn
        NOTE: note || 'Khách hàng hủy đơn',
      }),
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   * API: GET /categories/listProvinceById
   */
  async getProvinces(): Promise<{ status: number; data: Array<{ PROVINCE_ID: number; PROVINCE_NAME: string }> }> {
    const url = `${VTP_BASE_URL}/categories/listProvinceById`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': this.apiToken,
      },
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Lấy danh sách quận/huyện theo tỉnh
   * API: POST /categories/listDistrict
   */
  async getDistricts(provinceId: number): Promise<{ status: number; data: Array<{ DISTRICT_ID: number; DISTRICT_NAME: string }> }> {
    const url = `${VTP_BASE_URL}/categories/listDistrict`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify({ PROVINCE_ID: provinceId }),
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   * API: POST /categories/listWards
   */
  async getWards(districtId: number): Promise<{ status: number; data: Array<{ WARDS_ID: number; WARDS_NAME: string }> }> {
    const url = `${VTP_BASE_URL}/categories/listWards`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.apiToken,
      },
      body: JSON.stringify({ DISTRICT_ID: districtId }),
    });

    if (!response.ok) {
      throw new Error(`VTP API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

/**
 * VTP Status Code Mapping
 */
export const VTP_STATUS_MAP: Record<number, { text: string; color: string }> = {
  [-1]: { text: 'Hủy đơn hàng', color: 'destructive' },
  [100]: { text: 'Đơn hàng mới', color: 'secondary' },
  [101]: { text: 'Đã tiếp nhận', color: 'info' },
  [102]: { text: 'Đã lấy hàng', color: 'success' },
  [103]: { text: 'Đang vận chuyển', color: 'warning' },
  [104]: { text: 'Đã đến bưu cục', color: 'info' },
  [105]: { text: 'Đang giao hàng', color: 'warning' },
  [200]: { text: 'Giao hàng thành công', color: 'success' },
  [201]: { text: 'Đã đối soát', color: 'success' },
  [300]: { text: 'Giao hàng thất bại', color: 'destructive' },
  [301]: { text: 'Đang hoàn hàng', color: 'warning' },
  [302]: { text: 'Đã hoàn hàng', color: 'secondary' },
  [303]: { text: 'Hủy hoàn hàng', color: 'destructive' },
  [500]: { text: 'Đơn hàng ngoại lệ', color: 'destructive' },
  [501]: { text: 'Hàng mất/hư hỏng', color: 'destructive' },
};

/**
 * VTP Product Types
 */
export const VTP_PRODUCT_TYPES = {
  EXPRESS: 'VCN', // Viettel Chuyển Phát Nhanh
  STANDARD: 'VTK', // Viettel Tiết Kiệm
} as const;

/**
 * VTP Payment Types
 */
export const VTP_PAYMENT_TYPES = {
  SENDER_PAY: 1, // Người gửi trả phí
  RECEIVER_PAY: 2, // Người nhận trả phí
  BOTH_PAY: 3, // Cả 2 trả phí
} as const;
