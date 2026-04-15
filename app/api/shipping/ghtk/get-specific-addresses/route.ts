/**
 * GHTK Get Specific Addresses API
 * GET /api/shipping/ghtk/get-specific-addresses
 * 
 * Get specific addresses (street level) from GHTK
 * Query params: province, district, ward_street, apiToken
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { GHTK_API_BASE } from '@/lib/ghtk-sync'

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');
    const district = searchParams.get('district');
    const ward_street = searchParams.get('ward_street');
    const apiToken = searchParams.get('apiToken');


    if (!province || !district || !ward_street) {
      return apiError('Province, district, and ward_street are required', 400);
    }

    if (!apiToken) {
      return apiError('API Token is required', 400);
    }

    const url = `${GHTK_API_BASE}/services/address/getAddressLevel4?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}&ward_street=${encodeURIComponent(ward_street)}`;

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'Content-Type': 'application/json'
      },
    });


    const data = await response.json();
    

    return apiSuccess(data);
  } catch (error) {
    logError(`[GHTK-ADDR-${requestId}] ❌ Get specific addresses error`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
