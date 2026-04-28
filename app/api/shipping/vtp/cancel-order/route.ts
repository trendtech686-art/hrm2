/**
 * VTP Cancel Order API Proxy
 * POST /api/shipping/vtp/cancel-order
 * 
 * VTP Update Order (TYPE=4): POST /v2/order/UpdateOrder
 * Limitation: Chỉ hủy được đơn chưa nhận thành công (ORDER_STATUS < 200)
 * 
 * NOTE: Nếu ORDER_STATUS >= 200, đơn đã được Viettel Post xác nhận/partner approval.
 * Lúc này cần liên hệ Viettel Post để xử lý hủy hoặc đợi Viettel Post cancel trước.
 * Auth: Token header
 */

import { NextRequest } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

// VTP Order Status codes - orders can only be cancelled if status < 200
const VTP_CANCELLABLE_STATUS = 200;

export const POST = apiHandler(async (req) => {
  try {
    const body = await req.json();
    const { token, environment, orderNumber, note, orderStatus } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    if (!orderNumber) {
      return apiError('Mã đơn hàng (ORDER_NUMBER) là bắt buộc', 400);
    }

    // Validate order can be cancelled based on VTP status
    // NOTE: Đơn đã qua partner approval (ORDER_STATUS >= 200) không thể tự hủy được
    if (orderStatus !== undefined && orderStatus >= VTP_CANCELLABLE_STATUS) {
      return apiError(
        `Đơn hàng đã được Viettel Post xác nhận hoặc qua partner approval (Status: ${orderStatus}). Không thể tự hủy. Vui lòng liên hệ Viettel Post để được hỗ trợ.`,
        400
      );
    }

    const baseUrl = environment === 'staging'
      ? 'https://partnerdev.viettelpost.vn/v2'
      : 'https://partner.viettelpost.vn/v2';

    const response = await fetchWithTimeout(`${baseUrl}/order/UpdateOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Token': token,
      },
      body: JSON.stringify({
        TYPE: 4, // 4 = Hủy đơn hàng
        ORDER_NUMBER: orderNumber,
        NOTE: note || 'Khách hàng hủy đơn',
      }),
    });

    const data = await response.json();

    if (data.status === 200 && !data.error) {
      return apiSuccess({
        success: true,
        message: data.message || 'Hủy đơn Viettel Post thành công',
      });
    } else {
      return apiError(
        data.message || 'Hủy đơn Viettel Post thất bại',
        400
      );
    }
  } catch (error) {
    logError('[VTP-CANCEL] ❌ Error', error);
    return apiError(
      'Lỗi hủy đơn: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
});
