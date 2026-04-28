/**
 * GHN Test Connection API
 * POST /api/shipping/ghn/test-connection
 * 
 * Test GHN API connection bằng cách gọi Province API (endpoint đơn giản nhất)
 * GHN auth: Token header + ShopId header (nếu có)
 */

import { NextRequest } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

export const POST = apiHandler(async (req, { session }) => {
  const startTime = Date.now();

  const body = await req.json();
  const { token, shopId, environment } = body;

  if (!token) {
    return apiError('Token là bắt buộc', 400);
  }

  // Determine API base URL based on environment
  const baseUrl = environment === 'staging'
    ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
    : 'https://online-gateway.ghn.vn/shiip/public-api';

  try {
    // Step 1: Test Token bằng Province API
    const provinceResponse = await fetchWithTimeout(`${baseUrl}/master-data/province`, {
      method: 'GET',
      headers: {
        'Token': token,
      },
    });

    const provinceData = await provinceResponse.json();
    
    if (provinceData.code !== 200) {
      return apiError(
        provinceData.message || 'Token GHN không hợp lệ. Kiểm tra lại Token.',
        400
      );
    }

    // Step 2: Nếu có ShopId, verify Token+ShopId match bằng Shop Detail API
    if (shopId) {
      const shopResponse = await fetchWithTimeout(`${baseUrl}/v2/shop/detail`, {
        method: 'POST',
        headers: {
          'Token': token,
          'ShopId': String(shopId),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shop_id: Number(shopId) }),
      });

      const shopData = await shopResponse.json();
      
      if (shopData.code !== 200) {
        return apiError(
          shopData.message || `ShopId ${shopId} không hợp lệ hoặc không thuộc tài khoản này.`,
          400
        );
      }
    }

    const duration = Date.now() - startTime;

    return apiSuccess({
      success: true,
      message: shopId ? 'Kết nối GHN thành công (Token + ShopId đã xác thực)' : 'Token GHN hợp lệ',
      duration,
      data: {
        provinceCount: provinceData.data?.length || 0,
        environment: environment || 'production',
      },
    });
  } catch (error) {
    logError('GHN test connection failed', error)
    return apiError('Kết nối GHN thất bại. Vui lòng thử lại sau.', 500)
  }
}, {
  auth: true,
  rateLimit: { max: 10, windowMs: 60_000 }
});
