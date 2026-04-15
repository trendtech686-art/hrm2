/**
 * GHN Test Connection API
 * POST /api/shipping/ghn/test-connection
 * 
 * Test GHN API connection bằng cách gọi Province API (endpoint đơn giản nhất)
 * GHN auth: Token header + ShopId header (nếu có)
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const startTime = Date.now();

  try {
    const body = await request.json();
    const { token, shopId, environment } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    // Determine API base URL based on environment
    const baseUrl = environment === 'staging'
      ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
      : 'https://online-gateway.ghn.vn/shiip/public-api';

    // Test bằng cách gọi Province API (list tỉnh/thành phố)
    const response = await fetchWithTimeout(`${baseUrl}/master-data/province`, {
      method: 'GET',
      headers: {
        'Token': token,
        ...(shopId && { 'ShopId': String(shopId) }),
      },
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (data.code === 200) {
      return apiSuccess({
        success: true,
        message: 'Kết nối GHN thành công',
        duration,
        data: {
          provinceCount: data.data?.length || 0,
          environment: environment || 'production',
        },
      });
    } else {
      return apiError(
        data.message || 'Kết nối GHN thất bại. Kiểm tra lại Token.',
        400
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[GHN-TEST] ❌ Connection test error (${duration}ms)`, error);
    return apiError(
      'Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
