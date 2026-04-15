/**
 * GHN Tracking API Proxy
 * POST /api/shipping/ghn/tracking
 * 
 * GHN Order Detail: POST /v2/shipping-order/detail
 * Auth: Token header
 * Content-Type: application/json
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
    const { token, environment, orderCode } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    if (!orderCode) {
      return apiError('Mã đơn hàng (order_code) là bắt buộc', 400);
    }

    const baseUrl = environment === 'staging'
      ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
      : 'https://online-gateway.ghn.vn/shiip/public-api';

    const response = await fetchWithTimeout(`${baseUrl}/v2/shipping-order/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
      },
      body: JSON.stringify({ order_code: orderCode }),
    });

    const data = await response.json();

    if (data.code === 200) {
      return apiSuccess({
        success: true,
        data: data.data,
      });
    } else {
      return apiError(
        data.message || 'Không tìm thấy đơn hàng',
        400
      );
    }
  } catch (error) {
    logError('[GHN-TRACKING] ❌ Error', error);
    return apiError(
      'Lỗi tracking: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
