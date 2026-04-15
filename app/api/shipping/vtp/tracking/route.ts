/**
 * VTP Tracking API Proxy
 * POST /api/shipping/vtp/tracking
 * 
 * VTP Order Detail: POST /v2/order/getOrderInfoById
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
    const { token, environment, orderNumber } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    if (!orderNumber) {
      return apiError('Mã đơn hàng (ORDER_NUMBER) là bắt buộc', 400);
    }

    const baseUrl = environment === 'staging'
      ? 'https://partnerdev.viettelpost.vn/v2'
      : 'https://partner.viettelpost.vn/v2';

    const response = await fetchWithTimeout(`${baseUrl}/order/getOrderInfoById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Token': token,
      },
      body: JSON.stringify({ ORDER_NUMBER: orderNumber }),
    });

    const data = await response.json();

    if (data.status === 200 && !data.error) {
      return apiSuccess({
        success: true,
        data: data.data,
      });
    } else {
      return apiError(
        data.message || 'Tra cứu đơn Viettel Post thất bại',
        400
      );
    }
  } catch (error) {
    logError('[VTP-TRACKING] ❌ Error', error);
    return apiError(
      'Lỗi tra cứu: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
