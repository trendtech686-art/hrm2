/**
 * GHTK List Pick Addresses API
 * GET /api/shipping/ghtk/list-pick-addresses
 * 
 * Proxy to get list of registered pickup addresses from GHTK
 */

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { GHTK_API_BASE } from '@/lib/ghtk-sync'

export const GET = apiHandler(async (req) => {
  const requestId = randomUUID();

  try {
    const { searchParams } = new URL(req.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');


    if (!apiToken) {
      return apiError('API Token is required', 400);
    }

    const url = `${GHTK_API_BASE}/services/shipment/list_pick_add`;

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json'
      },
    });


    const data = await response.json();
    

    return apiSuccess(data);
  } catch (error) {
    logError(`[GHTK-PICK-${requestId}] ❌ Get pick addresses error`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}, {
  rateLimit: { max: 20, windowMs: 60_000 }
});
