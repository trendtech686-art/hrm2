/**
 * GHTK Cancel Order API
 * POST /api/shipping/ghtk/cancel-order
 * 
 * Proxy to cancel GHTK shipment order
 * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
 */

import { NextRequest } from 'next/server';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { cancelOrderSchema } from './validation';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, cancelOrderSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const { trackingCode, apiToken, partnerCode } = validation.data;

    // ✅ Client sẽ gửi token lên (lấy từ shipping_partners_config trong localStorage)
    if (!apiToken) {
      return apiError('Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.', 400);
    }

    if (!trackingCode) {
      return apiError('Mã vận đơn không được để trống', 400);
    }


    const response = await fetch(`${GHTK_API_BASE}/services/shipment/cancel/${trackingCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    

    // ✅ Trả về response từ GHTK (bao gồm cả success: false)
    return apiSuccess(data);
  } catch (error) {
    console.error(`[GHTK-CANCEL-${requestId}] Cancel order error:`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
