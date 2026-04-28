/**
 * GHN Tracking API Proxy
 * POST /api/shipping/ghn/tracking
 * 
 * GHN Order Detail: POST /v2/shipping-order/detail
 * Auth: Token header
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

    if (!response.ok) {
      const errorText = await response.text();
      logError('[GHN-TRACKING] API error', null, {
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
        data: data.data,
      });
    } else {
      logError('[GHN-TRACKING] API returned error', null, {
        code: data.code,
        message: data.message,
      });
      return apiError(
        data.message || 'Không tìm thấy đơn hàng',
        400
      );
    }
  } catch (error) {
    logError('[GHN-TRACKING] ❌ Tracking failed', error);
    return apiError(
      error instanceof Error ? error.message : 'Failed to track GHN order',
      500
    );
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
});
