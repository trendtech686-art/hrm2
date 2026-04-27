/**
 * GHTK Create Order API
 * POST /api/shipping/ghtk/create-order
 * 
 * Proxy to create GHTK shipment order
 */

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { createOrderSchema } from './validation';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { GHTK_API_BASE } from '@/lib/ghtk-sync'

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, createOrderSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    const { apiToken, partnerCode, ...orderData } = validation.data;

    if (!apiToken) {
      return apiError('API Token is required', 400);
    }


    const response = await fetchWithTimeout(`${GHTK_API_BASE}/services/shipment/order/?ver=1.5`, {
      method: 'POST',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    const _duration = Date.now() - startTime;
    

    return apiSuccess(data);
  } catch (error) {
    logError(`[GHTK-ORDER-${requestId}] ❌ Create order error`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
