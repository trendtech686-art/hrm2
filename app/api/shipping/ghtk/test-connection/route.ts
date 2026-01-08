/**
 * GHTK Test Connection API
 * GET /api/shipping/ghtk/test-connection
 * 
 * Test GHTK API connection with token
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const { searchParams } = new URL(request.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');


    if (!apiToken) {
      return apiError('API Token is required', 400);
    }


    // Test với endpoint đơn giản nhất - list pick addresses
    const response = await fetch(`${GHTK_API_BASE}/services/shipment/list_pick_add`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    const _duration = Date.now() - startTime;
    

    if (response.ok && data.success !== false) {
      // GHTK trả về data là array trực tiếp
      return apiSuccess({
        success: true,
        message: 'Kết nối GHTK thành công',
        status: response.status,
        data: {
          pickAddresses: data.data || [],
          pickAddressCount: data.data?.length || 0,
          apiBase: GHTK_API_BASE
        }
      });
    } else {
      return apiError(data.message || 'Kết nối thất bại', response.status || 400);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GHTK-TEST-${requestId}] ❌ Connection test error (${duration}ms):`, error);
    return apiError('Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}
