/**
 * GHTK Cancel Order API
 * POST /api/shipping/ghtk/cancel-order
 * 
 * Proxy to cancel GHTK shipment order
 * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
 */

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { apiHandler } from '@/lib/api-handler';
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { cancelOrderSchema } from './validation';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { GHTK_API_BASE } from '@/lib/ghtk-sync'

export const POST = apiHandler(async (req) => {
  const validation = await validateBody(req, cancelOrderSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  const requestId = randomUUID();

  try {
    const { trackingCode, apiToken, partnerCode } = validation.data;

    // ✅ Client sẽ gửi token lên (lấy từ shipping_partners_config trong localStorage)
    if (!apiToken) {
      return apiError('Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.', 400);
    }

    if (!trackingCode) {
      return apiError('Mã vận đơn không được để trống', 400);
    }


    const response = await fetchWithTimeout(`${GHTK_API_BASE}/services/shipment/cancel/${trackingCode}`, {
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
    logError(`[GHTK-CANCEL-${requestId}] Cancel order error`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}, {
  rateLimit: { max: 20, windowMs: 60_000 }
});
