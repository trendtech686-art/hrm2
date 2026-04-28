/**
 * GHN Calculate Fee API Proxy
 * POST /api/shipping/ghn/calculate-fee
 * 
 * GHN Fee: POST /v2/shipping-order/fee
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
    const { token, shopId, environment, feeData } = body;

    if (!token || !shopId) {
      return apiError('Token và Shop ID là bắt buộc', 400);
    }

    if (!feeData) {
      return apiError('Dữ liệu tính phí là bắt buộc', 400);
    }

    const baseUrl = environment === 'staging'
      ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
      : 'https://online-gateway.ghn.vn/shiip/public-api';

    const response = await fetchWithTimeout(`${baseUrl}/v2/shipping-order/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
        'ShopId': String(shopId),
      },
      body: JSON.stringify(feeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('[GHN-FEE] API error', null, {
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
      logError('[GHN-FEE] API returned error', null, {
        code: data.code,
        message: data.message,
      });
      return apiError(
        data.message || 'Tính phí GHN thất bại',
        400
      );
    }
  } catch (error) {
    logError('[GHN-FEE] ❌ Calculate fee failed', error);
    return apiError(
      error instanceof Error ? error.message : 'Failed to calculate GHN fee',
      500
    );
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
});
