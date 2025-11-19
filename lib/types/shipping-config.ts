/**
 * Shipping Configuration Types - V2 Multi-Account Structure
 */
import type { SystemId } from '../id-types.ts';

/**
 * Weight calculation mode
 */
export type WeightMode = 'FROM_PRODUCTS' | 'CUSTOM';

/**
 * Delivery requirement options
 */
export type DeliveryRequirement = 
  | 'ALLOW_CHECK_NOT_TRY'    // Cho xem hàng, không thử
  | 'ALLOW_TRY'              // Cho thử hàng
  | 'NOT_ALLOW_CHECK';       // Không cho xem hàng

/**
 * Global shipping configuration
 */
export interface GlobalShippingConfig {
  weight: {
    mode: WeightMode;
    customValue: number; // in grams
  };
  dimensions: {
    length: number; // cm
    width: number;  // cm
    height: number; // cm
  };
  requirement: DeliveryRequirement;
  note: string;
  autoSyncCancelStatus: boolean;
  autoSyncCODCollection: boolean;
  latePickupWarningDays: number;
  lateDeliveryWarningDays: number;
}

/**
 * Pickup address for a shipping partner
 */
export interface PickupAddress {
  id: string;
  hrm?: Record<string, unknown>;
  
  // SAPO branch mapping (internal)
  sapoBranchId?: SystemId;
  sapoBranchName?: string;
  sapoAddress?: string;
  sapoProvince?: string;
  sapoDistrict?: string;
  sapoWard?: string;
  sapoPhone?: string;
  
  // Legacy HRM branch mapping
  hrmBranchId?: string;
  hrmBranchName?: string;
  hrmAddress?: string;
  hrmProvince?: string;
  hrmDistrict?: string;
  hrmWard?: string;
  hrmPhone?: string;
  
  // Partner warehouse info
  partnerWarehouseId: string;      // ID from partner (e.g., GHTK pick_address_id)
  partnerWarehouseName: string;
  partnerWarehouseAddress: string;
  partnerWarehouseProvince: string;
  partnerWarehouseDistrict: string;
  partnerWarehouseWard?: string;
  partnerWarehouseTel?: string;
  
  isDefault: boolean;
  active: boolean;
}

/**
 * Default shipping settings for GHTK
 */
export interface GHTKDefaultSettings {
  // Vận chuyển bằng
  transport?: 'road' | 'fly'; // Đường bộ / Đường bay
  
  // Địa chỉ trả hàng
  useReturnAddress?: 0 | 1; // 0: trả về địa chỉ lấy hàng, 1: trả về địa chỉ khác
  returnAddress?: string;
  
  // Dự kiến giao hàng (ca)
  deliverWorkShift?: 1 | 2; // 1: sáng, 2: chiều
  
  // Hẹn ca lấy hàng
  pickWorkShift?: 1 | 2; // 1: sáng, 2: chiều
  
  // Người trả phí
  isFreeship?: 0 | 1; // 0: khách trả ship (mặc định), 1: shop trả ship
  
  // Lấy hàng tại
  pickOption?: 'cod' | 'post'; // cod: COD đến lấy, post: gửi tại bưu cục
  
  // Dịch vụ cộng thêm (tags)
  tags?: {
    hangDeVo?: boolean; // Tag 1: Hàng dễ vỡ
    // Tag 2: Giá trị cao - REMOVED: GHTK tự động tính dựa trên field "value"
    nongSanThucPhamKho?: boolean; // Tag 6: Nông sản/thực phẩm khô
    dongKiem?: boolean; // Tag 7: Đóng kiểm
    hangKhongXepChong?: boolean; // Tag 8: Hàng không xếp chồng
    choXemHang?: boolean; // Tag 10: Cho xem hàng
    goiShopKhiGapVanDe?: boolean; // Tag 13: Gọi shop khi khách không nhận
    giaoHang1PhanChonSanPham?: boolean; // Tag 17: Giao 1 phần chọn sản phẩm
    giao1PhanDoiTra?: boolean; // Tag 18: Giao 1 phần đổi trả
    thuTienHuyHang?: boolean; // Tag 19: Không giao được thu phí
    giaoHang1PhanThuHoiChungTu?: boolean; // Tag 62: Giao 1 phần thu hồi chứng từ
  };
  
  // Sub tags cho hàng cây cối (chỉ khi có tag cây cối)
  plantSubTags?: {
    hatGiong?: boolean; // Sub tag 1
    cayNon?: boolean; // Sub tag 2
    cayCoBau?: boolean; // Sub tag 3
    cayCoChauDeVo?: boolean; // Sub tag 4
    cayKhac?: boolean; // Sub tag 5
  };
}

/**
 * Partner account with credentials
 */
export interface PartnerAccount {
  id: string;
  name: string; // User-friendly name (e.g., "Tài khoản GHTK Hà Nội")
  active: boolean;
  isDefault: boolean;
  
  credentials: Record<string, any>; // Partner-specific credentials
  pickupAddresses: PickupAddress[];
  
  // Default settings (for GHTK)
  defaultSettings?: GHTKDefaultSettings;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Partner configuration
 */
export interface PartnerConfig {
  accounts: PartnerAccount[];
}

/**
 * Main shipping configuration
 */
export interface ShippingConfig {
  version: 2;
  partners: {
    GHN: PartnerConfig;
    GHTK: PartnerConfig;
    VTP: PartnerConfig;
    'J&T': PartnerConfig;
    SPX: PartnerConfig;
    VNPOST: PartnerConfig;
    NINJA_VAN: PartnerConfig;
    AHAMOVE: PartnerConfig;
  };
  global: GlobalShippingConfig;
  lastUpdated: string;
}
