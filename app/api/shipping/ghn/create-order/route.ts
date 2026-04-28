/**
 * GHN Create Order API Proxy
 * POST /api/shipping/ghn/create-order
 * 
 * GHN Create Order: POST /v2/shipping-order/create
 * Auth: Token header + ShopId header
 * Content-Type: application/json
 */

import { NextRequest } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

export const POST = apiHandler(async (req) => {
  try {
    const body = await req.json();
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

    if (!response.ok) {
      const errorText = await response.text();
      logError('[GHN-CREATE] API error', null, {
        status: response.status,
        body: errorText,
        environment,
      });
      return apiError(`GHN API error: ${response.status}`, response.status);
    }

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
      logError('[GHN-CREATE] API returned error', null, {
        code: data.code,
        message: data.message,
      });
      return apiError(
        data.message || 'Tạo đơn GHN thất bại',
        400
      );
    }
  } catch (error) {
    logError('[GHN-CREATE] ❌ Create order failed', error);
    return apiError(
      error instanceof Error ? error.message : 'Failed to create GHN order',
      500
    );
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
});
