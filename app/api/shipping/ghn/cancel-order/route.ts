/**
 * GHN Cancel Order API Proxy
 * POST /api/shipping/ghn/cancel-order
 * 
 * GHN Cancel: POST /v2/switch-status/cancel
 * Auth: Token header + ShopId header
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
    const { token, shopId, environment, orderCodes } = body;

    if (!token || !shopId) {
      return apiError('Token và Shop ID là bắt buộc', 400);
    }

    if (!orderCodes || !Array.isArray(orderCodes) || orderCodes.length === 0) {
      return apiError('Danh sách mã đơn hàng là bắt buộc', 400);
    }

    const baseUrl = environment === 'staging'
      ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
      : 'https://online-gateway.ghn.vn/shiip/public-api';

    const response = await fetchWithTimeout(`${baseUrl}/v2/switch-status/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
        'ShopId': String(shopId),
      },
      body: JSON.stringify({ order_codes: orderCodes }),
    });

    const data = await response.json();

    if (data.code === 200) {
      return apiSuccess({
        success: true,
        data: data.data,
      });
    } else {
      return apiError(
        data.message || 'Hủy đơn GHN thất bại',
        400
      );
    }
  } catch (error) {
    logError('[GHN-CANCEL] ❌ Error', error);
    return apiError(
      'Lỗi hủy đơn: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
