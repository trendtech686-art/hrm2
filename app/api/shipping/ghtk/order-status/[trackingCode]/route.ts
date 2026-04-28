/**
 * GHTK Order Status API
 * GET /api/shipping/ghtk/order-status/[trackingCode]
 * 
 * Proxy to get GHTK order status
 */

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { GHTK_API_BASE } from '@/lib/ghtk-sync'

type Props = {
  params: Promise<{ trackingCode: string }>;
};

export const GET = apiHandler(async (req, { params }) => {
  const requestId = randomUUID();
  const { trackingCode } = await params;

  try {
    const { searchParams } = new URL(req.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');

    if (!apiToken) {
      return apiError('API Token is required', 400);
    }


    const response = await fetchWithTimeout(`${GHTK_API_BASE}/services/shipment/v2/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    

    return apiSuccess(data);
  } catch (error) {
    logError(`[GHTK-STATUS-${requestId}] Get order status error`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
});
