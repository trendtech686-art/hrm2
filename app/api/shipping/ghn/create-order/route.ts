/**
 * GHN Create Order API Proxy
 * POST /api/shipping/ghn/create-order
 * 
 * GHN Create Order: POST /v2/shipping-order/create
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
    const { token, shopId, environment, orderData } = body;

    if (!token || !shopId) {
      return apiError('Token và Shop ID là bắt buộc', 400);
    }

    if (!orderData) {
      return apiError('Dữ liệu đơn hàng là bắt buộc', 400);
    }

    const baseUrl = environment === 'staging'
      ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
      : 'https://online-gateway.ghn.vn/shiip/public-api';

    const response = await fetchWithTimeout(`${baseUrl}/v2/shipping-order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
        'ShopId': String(shopId),
      },
      body: JSON.stringify(orderData),
      timeoutMs: 30_000,
    });

    const data = await response.json();

    if (data.code === 200) {
      return apiSuccess({
        success: true,
        orderCode: data.data?.order_code,
        totalFee: data.data?.total_fee,
        expectedDeliveryTime: data.data?.expected_delivery_time,
        sortCode: data.data?.sort_code,
        fee: data.data?.fee,
      });
    } else {
      return apiError(
        data.message || 'Tạo đơn GHN thất bại',
        400
      );
    }
  } catch (error) {
    logError('[GHN-CREATE-ORDER] ❌ Error', error);
    return apiError(
      'Lỗi tạo đơn: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
