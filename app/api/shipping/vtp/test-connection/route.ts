/**
 * VTP Test Connection API
 * POST /api/shipping/vtp/test-connection
 * 
 * Test VTP API connection bằng cách gọi Province API (endpoint đơn giản nhất)
 * VTP auth: Token header
 * Environments: partnerdev.viettelpost.vn (dev) | partner.viettelpost.vn (prod)
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
    const { token, environment } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    // Determine API base URL based on environment
    const baseUrl = environment === 'staging'
      ? 'https://partnerdev.viettelpost.vn/v2'
      : 'https://partner.viettelpost.vn/v2';

    // Test bằng cách gọi Province API (list tỉnh/thành phố)
    const response = await fetchWithTimeout(`${baseUrl}/categories/listProvinceById`, {
      method: 'GET',
      headers: {
        'Token': token,
      },
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (data.status === 200 && !data.error) {
      return apiSuccess({
        success: true,
        message: 'Kết nối Viettel Post thành công',
        duration,
        data: {
          provinceCount: Array.isArray(data.data) ? data.data.length : 0,
          environment: environment || 'production',
        },
      });
    } else {
      return apiError(
        data.message || 'Kết nối Viettel Post thất bại. Kiểm tra lại Token.',
        400
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[VTP-TEST] ❌ Connection test error (${duration}ms)`, error);
    return apiError(
      'Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
