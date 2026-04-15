/**
 * VTP Cancel Order API Proxy
 * POST /api/shipping/vtp/cancel-order
 * 
 * VTP Update Order (TYPE=4): POST /v2/order/UpdateOrder
 * Chỉ hủy được đơn chưa nhận thành công (ORDER_STATUS < 200)
 * Auth: Token header
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    const { token, environment, orderNumber, note } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    if (!orderNumber) {
      return apiError('Mã đơn hàng (ORDER_NUMBER) là bắt buộc', 400);
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
}
