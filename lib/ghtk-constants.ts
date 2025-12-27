/**
 * GHTK Status Mapping & Constants
 * Based on GHTK API documentation: https://api.ghtk.vn/docs/submit-order/webhook
 */

import type { OrderDeliveryStatus } from '@/features/orders/store';

export type GHTKStatusId = -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 20 | 21 | 123 | 127 | 128 | 45 | 49 | 410;

export type GHTKReasonCode = 
  // Chậm lấy hàng (100-107)
  | '100' | '101' | '102' | '103' | '104' | '105' | '106' | '107'
  // Không lấy được (110-115)
  | '110' | '111' | '112' | '113' | '114' | '115'
  // Chậm giao (120-129)
  | '120' | '121' | '122' | '123' | '124' | '125' | '126' | '127' | '128' | '129' | '1200'
  // Không giao được (130-135)
  | '130' | '131' | '132' | '133' | '134' | '135'
  // Delay trả hàng (140-144)
  | '140' | '141' | '142' | '143' | '144';

export interface GHTKStatusMapping {
  statusId: GHTKStatusId;
  statusText: string;
  deliveryStatus: OrderDeliveryStatus;
  description: string;
  canCancel: boolean; // Có thể hủy qua API không
  shouldUpdateStock: boolean; // Có cần update stock không
  stockAction?: 'dispatch' | 'complete' | 'return'; // Loại stock action
  isFinal: boolean; // Trạng thái cuối (không cần sync nữa)
}

/**
 * Complete GHTK Status Mapping
 */
export const GHTK_STATUS_MAP: Record<GHTKStatusId, GHTKStatusMapping> = {
  '-1': {
    statusId: -1,
    statusText: 'Hủy đơn hàng',
    deliveryStatus: 'Chờ giao lại',
    description: 'Đơn hàng đã bị hủy',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  '1': {
    statusId: 1,
    statusText: 'Chưa tiếp nhận',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'GHTK chưa tiếp nhận đơn hàng',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '2': {
    statusId: 2,
    statusText: 'Đã tiếp nhận',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'GHTK đã tiếp nhận và đang chuẩn bị lấy hàng',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '3': {
    statusId: 3,
    statusText: 'Đã lấy hàng/Đã nhập kho',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper đã lấy hàng thành công',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'dispatch',
    isFinal: false,
  },
  '4': {
    statusId: 4,
    statusText: 'Đã điều phối giao hàng/Đang giao hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Đơn hàng đang được giao đến khách',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '5': {
    statusId: 5,
    statusText: 'Đã giao hàng/Chưa đối soát',
    deliveryStatus: 'Đã giao hàng',
    description: 'Giao hàng thành công, chưa đối soát',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'complete',
    isFinal: false,
  },
  '6': {
    statusId: 6,
    statusText: 'Đã đối soát',
    deliveryStatus: 'Đã giao hàng',
    description: 'Đã đối soát COD với GHTK',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: true,
  },
  '7': {
    statusId: 7,
    statusText: 'Không lấy được hàng',
    deliveryStatus: 'Chờ giao lại',
    description: 'Shipper không lấy được hàng từ người gửi',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: false,
  },
  '8': {
    statusId: 8,
    statusText: 'Hoãn lấy hàng',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Lấy hàng bị hoãn, sẽ lấy lại sau',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '9': {
    statusId: 9,
    statusText: 'Không giao được hàng',
    deliveryStatus: 'Chờ giao lại',
    description: 'Giao hàng thất bại, sẽ giao lại hoặc trả hàng',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: false,
  },
  '10': {
    statusId: 10,
    statusText: 'Delay giao hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Giao hàng bị chậm trễ',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '11': {
    statusId: 11,
    statusText: 'Đã đối soát công nợ trả hàng',
    deliveryStatus: 'Chờ giao lại',
    description: 'Đã đối soát tiền trả hàng',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: true,
  },
  '12': {
    statusId: 12,
    statusText: 'Đã điều phối lấy hàng/Đang lấy hàng',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Shipper đang trên đường đến lấy hàng',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '13': {
    statusId: 13,
    statusText: 'Đơn hàng bồi hoàn',
    deliveryStatus: 'Chờ giao lại',
    description: 'Đơn hàng bị mất/hỏng, đang xử lý bồi hoàn',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  '20': {
    statusId: 20,
    statusText: 'Đang trả hàng (COD cầm hàng đi trả)',
    deliveryStatus: 'Chờ giao lại',
    description: 'Shipper đang mang hàng về trả người gửi',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: false,
  },
  '21': {
    statusId: 21,
    statusText: 'Đã trả hàng (COD đã trả xong hàng)',
    deliveryStatus: 'Chờ giao lại',
    description: 'Đã trả hàng về cho người gửi',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: true,
  },
  '123': {
    statusId: 123,
    statusText: 'Shipper báo đã lấy hàng',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Shipper cập nhật đã lấy hàng (chưa xác nhận)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '127': {
    statusId: 127,
    statusText: 'Shipper báo không lấy được hàng',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Shipper báo không lấy được (chưa xác nhận)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '128': {
    statusId: 128,
    statusText: 'Shipper báo delay lấy hàng',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Shipper báo hoãn lấy hàng (chưa xác nhận)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '45': {
    statusId: 45,
    statusText: 'Shipper báo đã giao hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper cập nhật đã giao (chưa xác nhận)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '49': {
    statusId: 49,
    statusText: 'Shipper báo không giao được hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper báo giao thất bại (chưa xác nhận)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  '410': {
    statusId: 410,
    statusText: 'Shipper báo delay giao hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper báo hoãn giao hàng (chưa xác nhận)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
};

/**
 * Reason code mappings
 */
export const GHTK_REASON_MAP: Record<GHTKReasonCode, string> = {
  // Chậm lấy hàng (100-107)
  '100': 'Nhà cung cấp (NCC) hẹn lấy vào ca tiếp theo',
  '101': 'GHTK không liên lạc được với NCC',
  '102': 'NCC chưa có hàng',
  '103': 'NCC đổi địa chỉ',
  '104': 'NCC hẹn ngày lấy hàng',
  '105': 'GHTK quá tải, không lấy kịp',
  '106': 'Do điều kiện thời tiết, khách quan',
  '107': 'Lý do khác',
  
  // Không lấy được hàng (110-115)
  '110': 'Địa chỉ ngoài vùng phục vụ',
  '111': 'Hàng không nhận vận chuyển',
  '112': 'NCC báo hủy',
  '113': 'NCC hoãn/không liên lạc được 3 lần',
  '114': 'Lý do khác',
  '115': 'Đối tác hủy đơn qua API',
  
  // Chậm giao hàng (120-1200)
  '120': 'GHTK quá tải, giao không kịp',
  '121': 'Người nhận hàng hẹn giao ca tiếp theo',
  '122': 'Không gọi được cho người nhận hàng',
  '123': 'Người nhận hàng hẹn ngày giao',
  '124': 'Người nhận hàng chuyển địa chỉ nhận mới',
  '125': 'Địa chỉ người nhận sai, cần NCC check lại',
  '126': 'Do điều kiện thời tiết, khách quan',
  '127': 'Lý do khác',
  '128': 'Đối tác hẹn thời gian giao hàng',
  '129': 'Không tìm thấy hàng',
  '1200': 'SĐT người nhận sai, cần NCC check lại',
  
  // Không giao được hàng (130-135)
  '130': 'Người nhận không đồng ý nhận sản phẩm',
  '131': 'Không liên lạc được với KH 3 lần',
  '132': 'KH hẹn giao lại quá 3 lần',
  '133': 'Shop báo hủy đơn hàng',
  '134': 'Lý do khác',
  '135': 'Đối tác hủy đơn qua API',
  
  // Delay trả hàng (140-144)
  '140': 'NCC hẹn trả ca sau',
  '141': 'Không liên lạc được với NCC',
  '142': 'NCC không có nhà',
  '143': 'NCC hẹn ngày trả',
  '144': 'Lý do khác',
};

/**
 * Helper functions
 */

export function getGHTKStatusInfo(statusId: number): GHTKStatusMapping | null {
  return GHTK_STATUS_MAP[statusId as GHTKStatusId] || null;
}

/**
 * Get GHTK status text
 */
export function getGHTKStatusText(statusId: number): string {
  const info = getGHTKStatusInfo(statusId);
  return info?.statusText || `Trạng thái #${statusId}`;
}

export function getGHTKReasonText(reasonCode: string): string {
  return GHTK_REASON_MAP[reasonCode as GHTKReasonCode] || reasonCode;
}

export function canCancelGHTKShipment(statusId?: number): boolean {
  if (!statusId) return false;
  const info = getGHTKStatusInfo(statusId);
  return info?.canCancel || false;
}

export function shouldSyncGHTKStatus(statusId?: number): boolean {
  if (!statusId) return true; // Sync nếu chưa có status
  const info = getGHTKStatusInfo(statusId);
  return !info?.isFinal; // Sync nếu chưa đến trạng thái cuối
}

/**
 * Badge variant for UI
 */
export function getGHTKStatusVariant(statusId?: number): 'default' | 'secondary' | 'success' | 'destructive' | 'warning' {
  if (!statusId) return 'secondary';
  
  const info = getGHTKStatusInfo(statusId);
  if (!info) return 'secondary';
  
  // Đã giao hàng, đã đối soát
  if ([5, 6].includes(statusId)) return 'success';
  
  // Hủy, không lấy/giao được, bồi hoàn
  if ([-1, 7, 9, 13].includes(statusId)) return 'destructive';
  
  // Delay, hoãn
  if ([8, 10].includes(statusId)) return 'warning';
  
  // Đang xử lý
  if ([3, 4, 12].includes(statusId)) return 'default';
  
  return 'secondary';
}
