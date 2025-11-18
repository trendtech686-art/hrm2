/**
 * SPX Express (Shopee Express) via Shopee Open Platform API
 * Documentation: https://open.shopee.com/documents?module=95&type=1
 * 
 * SPX Express is integrated through Shopee Open API as one of the logistics channels.
 * 
 * Setup Process:
 * 1. Register at https://open.shopee.com
 * 2. Create application → Get Partner ID & Partner Key
 * 3. Implement OAuth flow → Get shop access_token
 * 4. Use Logistics API with proper authentication
 * 
 * Key APIs:
 * - v2.logistics.get_channel_list: Get available channels (SPX, etc.)
 * - v2.logistics.get_shipping_parameter: Get shipping requirements
 * - v2.logistics.ship_order: Create shipping order
 * - v2.logistics.get_tracking_number: Get tracking number
 * - v2.logistics.get_logistics_info: Track order status
 * 
 * Authentication: HMAC-SHA256(path + timestamp + access_token + shop_id + partner_id)
 */

const SHOPEE_API_URL = 'https://partner.shopeemobile.com';
const SHOPEE_TEST_API_URL = 'https://partner.test-stable.shopeemobile.com';

// Shopee Logistics Response Types
export type ShopeeLogisticsChannel = {
  logistics_channel_id: number;
  logistics_channel_name: string; // e.g., "SPX Express"
  cod_enabled: boolean;
  enabled: boolean;
  fee_type: string; // "SIZE_SELECTION", "CUSTOM_PRICE"
  sizes?: Array<{
    size_id: number;
    name: string;
    default_price: number;
  }>;
  weight_limits?: {
    item_max_weight: number;
    item_min_weight: number;
  };
  item_max_dimension?: {
    height: number;
    width: number;
    length: number;
    unit: string; // "cm"
  };
  volume_limit?: Array<{
    volume_limit_id: number;
    volume_limit: number;
  }>;
  logistics_description?: string;
  shipping_fee?: number;
  preferred: boolean;
  force_enable: boolean;
};

export type ShopeeShippingParameterResponse = {
  error?: string;
  message?: string;
  warning?: string;
  request_id?: string;
  response?: {
    info_needed?: {
      dropoff?: boolean;
      pickup?: boolean;
      slug?: string[];
    };
    dropoff?: Array<{
      branch_id: number;
      branch_name: string;
      address: string;
    }>;
    pickup?: {
      address_flag: boolean[]; // [pickup_time_needed, address_list_needed]
      time_slot_list?: Array<{
        date: string;
        time_slot: Array<{
          time_text: string;
          pickup_time_id: string;
        }>;
      }>;
      address_list?: Array<{
        address_id: number;
        address: string;
      }>;
    };
  };
};

export type ShopeeShipOrderResponse = {
  error?: string;
  message?: string;
  warning?: string;
  request_id?: string;
};

export type ShopeeTrackingNumberResponse = {
  error?: string;
  message?: string;
  request_id?: string;
  response?: {
    tracking_number?: string;
    plp_number?: string;
  };
};

export type ShopeeLogisticsInfoResponse = {
  error?: string;
  message?: string;
  request_id?: string;
  response?: {
    order_status?: string;
    tracking_info?: Array<{
      update_time: number;
      description: string;
      status: string;
    }>;
  };
};

// Parameters for Shopee Logistics APIs
export type ShopeeGetChannelListParams = {
  shop_id: number;
  access_token: string;
};

export type ShopeeGetShippingParameterParams = {
  shop_id: number;
  access_token: string;
  order_sn: string; // Shopee order number
};

export type ShopeeShipOrderParams = {
  shop_id: number;
  access_token: string;
  order_sn: string;
  // Optional params depending on info_needed
  dropoff?: {
    branch_id?: number;
    sender_real_name?: string;
    tracking_number?: string;
    slug?: string[];
  };
  pickup?: {
    address_id?: number;
    pickup_time_id?: string;
    tracking_number?: string;
  };
  non_integrated?: {
    tracking_number?: string;
  };
};

export type ShopeeGetTrackingNumberParams = {
  shop_id: number;
  access_token: string;
  order_sn: string;
  response_optional_fields?: string; // "plp_number"
};

export type ShopeeGetLogisticsInfoParams = {
  shop_id: number;
  access_token: string;
  order_sn: string;
};

/**
 * SPX Service via Shopee Open Platform
 * 
 * Note: This service wraps Shopee Logistics API.
 * SPX is one of the available logistics channels in Shopee.
 */
export class SPXService {
  private partnerId: number;
  private partnerKey: string;
  private testMode: boolean;

  constructor(partnerId: number, partnerKey: string, testMode: boolean = false) {
    this.partnerId = partnerId;
    this.partnerKey = partnerKey;
    this.testMode = testMode;
  }

  /**
   * Get base URL
   */
  private getBaseUrl(): string {
    return this.testMode ? SHOPEE_TEST_API_URL : SHOPEE_API_URL;
  }

  /**
   * Generate authentication signature
   * HMAC-SHA256(api_path + timestamp + access_token + shop_id + partner_id)
   */
  private async generateSignature(
    path: string,
    timestamp: number,
    accessToken: string,
    shopId: number
  ): Promise<string> {
    const baseString = `${path}${timestamp}${accessToken}${shopId}${this.partnerId}`;
    
    // Use Web Crypto API for HMAC-SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.partnerKey);
    const messageData = encoder.encode(baseString);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Make authenticated API request to Shopee
   */
  private async makeRequest<T>(
    path: string,
    params: any
  ): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000);
    const { shop_id, access_token, ...bodyParams } = params;
    
    const signature = await this.generateSignature(path, timestamp, access_token, shop_id);
    
    const url = new URL(`${this.getBaseUrl()}${path}`);
    url.searchParams.append('partner_id', this.partnerId.toString());
    url.searchParams.append('timestamp', timestamp.toString());
    url.searchParams.append('access_token', access_token);
    url.searchParams.append('shop_id', shop_id.toString());
    url.searchParams.append('sign', signature);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    });

    if (!response.ok) {
      throw new Error(`Shopee API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Lấy danh sách kênh vận chuyển (bao gồm SPX)
   * API: POST /api/v2/logistics/get_channel_list
   */
  async getChannelList(
    params: ShopeeGetChannelListParams
  ): Promise<{ error?: string; response?: { logistics_channel_list: ShopeeLogisticsChannel[] } }> {
    return this.makeRequest('/api/v2/logistics/get_channel_list', params);
  }

  /**
   * Lấy thông tin cần thiết để ship đơn hàng
   * API: POST /api/v2/logistics/get_shipping_parameter
   */
  async getShippingParameter(
    params: ShopeeGetShippingParameterParams
  ): Promise<ShopeeShippingParameterResponse> {
    return this.makeRequest('/api/v2/logistics/get_shipping_parameter', params);
  }

  /**
   * Tạo đơn vận chuyển (ship order)
   * API: POST /api/v2/logistics/ship_order
   */
  async shipOrder(
    params: ShopeeShipOrderParams
  ): Promise<ShopeeShipOrderResponse> {
    return this.makeRequest('/api/v2/logistics/ship_order', params);
  }

  /**
   * Lấy tracking number sau khi ship
   * API: POST /api/v2/logistics/get_tracking_number
   */
  async getTrackingNumber(
    params: ShopeeGetTrackingNumberParams
  ): Promise<ShopeeTrackingNumberResponse> {
    return this.makeRequest('/api/v2/logistics/get_tracking_number', params);
  }

  /**
   * Lấy thông tin vận chuyển (tracking)
   * API: POST /api/v2/logistics/get_logistics_info
   */
  async getLogisticsInfo(
    params: ShopeeGetLogisticsInfoParams
  ): Promise<ShopeeLogisticsInfoResponse> {
    return this.makeRequest('/api/v2/logistics/get_logistics_info', params);
  }

  /**
   * Helper: Tìm SPX channel trong danh sách logistics
   */
  async findSPXChannel(shopId: number, accessToken: string): Promise<ShopeeLogisticsChannel | null> {
    const result = await this.getChannelList({ shop_id: shopId, access_token: accessToken });
    
    if (result.error || !result.response?.logistics_channel_list) {
      return null;
    }

    return result.response.logistics_channel_list.find(
      channel => channel.logistics_channel_name.toLowerCase().includes('spx')
    ) || null;
  }
}

/**
 * Shopee Order Status Mapping
 */
export const SHOPEE_ORDER_STATUS_MAP: Record<string, { text: string; color: string }> = {
  'UNPAID': { text: 'Chưa thanh toán', color: 'secondary' },
  'READY_TO_SHIP': { text: 'Chờ lấy hàng', color: 'warning' },
  'PROCESSED': { text: 'Đã xử lý', color: 'info' },
  'RETRY_SHIP': { text: 'Lấy hàng lại', color: 'warning' },
  'SHIPPED': { text: 'Đã giao cho ĐVVC', color: 'info' },
  'TO_CONFIRM_RECEIVE': { text: 'Chờ xác nhận', color: 'warning' },
  'IN_CANCEL': { text: 'Đang hủy', color: 'warning' },
  'CANCELLED': { text: 'Đã hủy', color: 'destructive' },
  'TO_RETURN': { text: 'Chờ trả hàng', color: 'warning' },
  'COMPLETED': { text: 'Hoàn thành', color: 'success' },
  'IN_TRANSIT': { text: 'Đang vận chuyển', color: 'warning' },
  'DELIVERED': { text: 'Đã giao hàng', color: 'success' },
};

/**
 * SPX Integration Guide via Shopee Open Platform
 * 
 * Prerequisites:
 * 1. Shopee Seller Account: Register at https://shopee.vn
 * 2. Shopee Partner Account: Register at https://open.shopee.com
 * 3. Create Application: Get Partner ID & Partner Key
 * 
 * OAuth Flow:
 * 1. Redirect user to: https://partner.shopeemobile.com/api/v2/shop/auth_partner
 *    Params: partner_id, redirect_url, state
 * 2. User authorizes → Shopee redirects back with code & shop_id
 * 3. Exchange code for access_token & refresh_token:
 *    POST /api/v2/auth/token/get
 * 4. Save access_token (valid 4 hours) & refresh_token (valid 30 days)
 * 5. Refresh token when expired:
 *    POST /api/v2/auth/access_token/get
 * 
 * Workflow:
 * 1. Get available logistics channels (includes SPX if enabled)
 * 2. Customer places order on Shopee
 * 3. Get shipping parameter (pickup/dropoff requirements)
 * 4. Ship order with required info
 * 5. Get tracking number
 * 6. Track order status via get_logistics_info
 * 
 * Important Notes:
 * - SPX must be enabled in your Shopee seller account
 * - Different regions may have different logistics channels
 * - Some channels require dropoff (branch_id), others support pickup
 * - COD availability varies by channel
 * - Signature must be generated correctly (HMAC-SHA256)
 * 
 * Example Usage:
 * ```typescript
 * const spxService = new SPXService(PARTNER_ID, PARTNER_KEY, false);
 * 
 * // 1. Get channels
 * const channels = await spxService.getChannelList({ shop_id, access_token });
 * const spxChannel = await spxService.findSPXChannel(shop_id, access_token);
 * 
 * // 2. Get shipping requirements
 * const params = await spxService.getShippingParameter({ shop_id, access_token, order_sn });
 * 
 * // 3. Ship order
 * await spxService.shipOrder({
 *   shop_id,
 *   access_token,
 *   order_sn,
 *   dropoff: { branch_id: 123 }, // or pickup
 * });
 * 
 * // 4. Get tracking
 * const tracking = await spxService.getTrackingNumber({ shop_id, access_token, order_sn });
 * 
 * // 5. Track status
 * const info = await spxService.getLogisticsInfo({ shop_id, access_token, order_sn });
 * ```
 * 
 * Resources:
 * - Docs: https://open.shopee.com/documents?module=95&type=1
 * - Forum: https://developer.shopee.com
 * - Support: Contact via Shopee Open Platform dashboard
 */

/**
 * Helper: Calculate HMAC-SHA256 signature for Shopee API
 * Can be used standalone if needed
 */
export async function calculateShopeeSignature(
  partnerKey: string,
  path: string,
  timestamp: number,
  accessToken: string,
  shopId: number,
  partnerId: number
): Promise<string> {
  const baseString = `${path}${timestamp}${accessToken}${shopId}${partnerId}`;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(partnerKey);
  const messageData = encoder.encode(baseString);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
