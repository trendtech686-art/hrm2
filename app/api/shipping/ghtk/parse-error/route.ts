/**
 * GHTK Parse Error API
 * POST /api/shipping/ghtk/parse-error
 * 
 * Helper endpoint to parse GHTK error responses
 */

import { NextRequest } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';

/**
 * Map GHTK error codes to Vietnamese messages
 */
function getGHTKErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'ERROR_ADDRESS': 'Địa chỉ không hợp lệ hoặc nằm ngoài vùng phục vụ',
    'ERROR_PICK_ADDRESS': 'Địa chỉ lấy hàng không hợp lệ',
    'ERROR_WEIGHT': 'Khối lượng đơn hàng không hợp lệ',
    'ERROR_VALUE': 'Giá trị đơn hàng không hợp lệ',
    'ERROR_ORDER_EXISTED': 'Mã đơn hàng đã tồn tại trên hệ thống',
    'ERROR_TOKEN': 'Token không hợp lệ hoặc đã hết hạn',
    'ERROR_PERMISSION': 'Không có quyền thực hiện thao tác này',
    'ERROR_ORDER_NOT_FOUND': 'Không tìm thấy đơn hàng',
    'ERROR_CANCEL_TIMEOUT': 'Không thể hủy đơn (đơn đã được lấy hàng)',
    'ERROR_PROVINCE': 'Tỉnh/Thành phố không hợp lệ',
    'ERROR_DISTRICT': 'Quận/Huyện không hợp lệ',
    'ERROR_WARD': 'Phường/Xã không hợp lệ',
    'ERROR_PICK_SHIFT': 'Ca lấy hàng không hợp lệ',
    'ERROR_DELIVER_SHIFT': 'Ca giao hàng không hợp lệ',
    'ERROR_COD': 'Số tiền thu hộ vượt quá giới hạn',
  };

  return errorMessages[errorCode] || 'Lỗi không xác định từ GHTK';
}

export const POST = apiHandler(async (req) => {
  try {
    const body = await req.json();
    const { error } = body;
    
    if (!error) {
      return apiSuccess({ message: 'Không có lỗi' });
    }

    const errorCode = error.code || error.error || 'UNKNOWN';
    const message = getGHTKErrorMessage(errorCode);

    return apiSuccess({
      code: errorCode,
      message: message,
      originalError: error
    });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}, {
  rateLimit: { max: 20, windowMs: 60_000 }
});
